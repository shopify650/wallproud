-- On-Site Collection Widgets
-- Stores configuration for embeddable testimonial collection forms

create table if not exists public.collect_widgets (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null default 'On-Site Widget',
  display_type text not null default 'floating' check (display_type in ('floating', 'inline', 'popup')),
  position text not null default 'bottom-right' check (position in ('bottom-right', 'bottom-left', 'bottom-center')),
  trigger text not null default 'click' check (trigger in ('click', 'scroll', 'exit-intent', 'timed')),
  scroll_percent integer not null default 70,
  delay_seconds integer not null default 5,
  primary_color text not null default '#000000',
  heading text not null default 'We''d love your feedback!',
  description text not null default 'Share your experience with us',
  placeholder text not null default 'Tell us about your experience...',
  thank_you_message text not null default 'Thanks for your feedback!',
  show_star_rating boolean not null default true,
  show_name boolean not null default true,
  name_required boolean not null default true,
  show_email boolean not null default true,
  email_required boolean not null default false,
  show_company boolean not null default false,
  company_required boolean not null default false,
  show_phone boolean not null default false,
  phone_required boolean not null default false,
  show_video boolean not null default false,
  max_characters integer not null default 5000,
  min_characters integer not null default 10,
  auto_close_seconds integer not null default 3,
  show_confetti boolean not null default true,
  show_powered_by boolean not null default true,
  auto_approve_5star boolean not null default false,
  allowed_domains text[] not null default '{}',
  is_active boolean not null default true,
  submission_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.collect_widgets enable row level security;

create policy "Users can manage their own collect widgets"
  on public.collect_widgets
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

-- Rate limiting table: tracks submissions per IP per workspace
create table if not exists public.submission_ips (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  ip_address text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_submission_ips_workspace_ip
  on public.submission_ips (workspace_id, ip_address);

alter table public.submission_ips enable row level security;

-- Allow public insert (anon visitors submitting testimonials)
create policy "Anyone can insert submission ips"
  on public.submission_ips
  for insert
  with check (true);

-- Workspace owners can read their own
create policy "Users can read their own submission ips"
  on public.submission_ips
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

-- Updated_at trigger
create or replace function public.update_collect_widgets_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_collect_widgets_updated_at
  before update on public.collect_widgets
  for each row execute function public.update_collect_widgets_updated_at();

-- Allow public (anon) access to read active widget config by ID
-- Used by the embed script running on customer websites
create policy "Public can read active collect widgets"
  on public.collect_widgets
  for select
  using (is_active = true);

-- Allow public insert of testimonials into workspaces via collect widgets
-- The widget ID must exist and be active
create or replace function public.submit_collect_widget_testimonial(
  p_widget_id uuid,
  p_author_name text,
  p_author_email text default null,
  p_author_company text default null,
  p_content text,
  p_rating integer default null,
  p_page_url text default null,
  p_referrer text default null,
  p_ip_address text default null
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_workspace_id uuid;
  v_auto_approve boolean;
  v_status text;
begin
  -- Validate widget exists and is active
  select workspace_id, auto_approve_5star into v_workspace_id, v_auto_approve
  from public.collect_widgets
  where id = p_widget_id and is_active = true;

  if v_workspace_id is null then
    return jsonb_build_object('error', 'Widget not found or inactive');
  end if;

  -- Rate limit: 1 submission per IP per 24h per workspace
  if p_ip_address is not null then
    if exists (
      select 1 from public.submission_ips
      where workspace_id = v_workspace_id
        and ip_address = p_ip_address
        and created_at > now() - interval '24 hours'
    ) then
      return jsonb_build_object('error', 'Rate limit exceeded');
    end if;
  end if;

  -- Determine initial status
  v_status := 'pending';
  if v_auto_approve and p_rating is not null and p_rating >= 5 then
    v_status := 'approved';
  end if;

  -- Insert testimonial
  insert into public.testimonials (
    workspace_id, author_name, author_email, author_company,
    content, rating, source, status, metadata
  ) values (
    v_workspace_id, p_author_name, p_author_email, p_author_company,
    p_content, p_rating, 'email', v_status,
    jsonb_build_object(
      'collect_widget_id', p_widget_id,
      'page_url', p_page_url,
      'referrer', p_referrer
    )
  );

  -- Track IP for rate limiting
  if p_ip_address is not null then
    insert into public.submission_ips (workspace_id, ip_address)
    values (v_workspace_id, p_ip_address);
  end if;

  -- Increment submission count
  update public.collect_widgets
  set submission_count = submission_count + 1
  where id = p_widget_id;

  return jsonb_build_object('success', true, 'status', v_status);
end;
$$;
