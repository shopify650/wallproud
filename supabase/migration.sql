-- ============================================================================
-- WallProud - Complete Database Schema
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. EXTENSIONS
-- ----------------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- 2. UPDATED_AT TRIGGER FUNCTION
-- ----------------------------------------------------------------------------
create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- 3. TABLES (idempotent — CREATE TABLE IF NOT EXISTS + ALTER ADD COLUMN)
-- ----------------------------------------------------------------------------

-- 3a. USERS
create table if not exists public.users (
  id                  uuid        primary key references auth.users(id) on delete cascade,
  email               text        not null unique,
  full_name           text,
  avatar_url          text
);
alter table public.users add column if not exists plan                text        not null default 'free' check (plan in ('free', 'starter', 'pro', 'agency'));
alter table public.users add column if not exists stripe_customer_id  text;
alter table public.users add column if not exists stripe_subscription_id text;
alter table public.users add column if not exists created_at          timestamptz not null default now();
alter table public.users add column if not exists updated_at          timestamptz not null default now();

-- 3b. WORKSPACES
create table if not exists public.workspaces (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references public.users(id) on delete cascade,
  name          text        not null,
  slug          text        not null unique,
  logo_url      text,
  primary_color text        not null default '#6366f1',
  settings      jsonb       not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- 3c. TESTIMONIALS
create table if not exists public.testimonials (
  id            uuid        primary key default gen_random_uuid(),
  workspace_id  uuid        not null references public.workspaces(id) on delete cascade,
  author_name   text        not null,
  author_email  text,
  author_image  text,
  author_company text,
  author_role   text,
  content       text        not null,
  rating        integer     check (rating >= 1 and rating <= 5)
);
alter table public.testimonials add column if not exists video_url     text;
alter table public.testimonials add column if not exists source        text        check (source in ('manual', 'email', 'google', 'twitter', 'import'));
alter table public.testimonials add column if not exists tags          text[]      not null default '{}'::text[];
alter table public.testimonials add column if not exists ai_summary    text;
alter table public.testimonials add column if not exists ai_topics     text[]      not null default '{}'::text[];
alter table public.testimonials add column if not exists status        text        not null default 'approved' check (status in ('pending', 'approved', 'rejected'));
alter table public.testimonials add column if not exists featured      boolean     not null default false;
alter table public.testimonials add column if not exists metadata      jsonb       not null default '{}'::jsonb;
alter table public.testimonials add column if not exists collected_at  timestamptz not null default now();
alter table public.testimonials add column if not exists created_at    timestamptz not null default now();

-- 3d. WIDGETS
create table if not exists public.widgets (
  id               uuid        primary key default gen_random_uuid(),
  workspace_id     uuid        not null references public.workspaces(id) on delete cascade,
  name             text        not null,
  type             text        not null check (type in ('grid', 'carousel', 'wall', 'slider', 'minimal', 'masonry')),
  config           jsonb       not null default '{}'::jsonb,
  testimonial_ids  uuid[]      not null default '{}'::uuid[],
  embed_code       text,
  views_count      integer     not null default 0,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- 3e. COLLECTIONS
create table if not exists public.collections (
  id               uuid        primary key default gen_random_uuid(),
  workspace_id     uuid        not null references public.workspaces(id) on delete cascade,
  name             text        not null,
  description      text,
  testimonial_ids  uuid[]      not null default '{}'::uuid[],
  share_url        text        unique,
  views_count      integer     not null default 0,
  created_at       timestamptz not null default now()
);

-- 3f. COLLECTION_REQUESTS
create table if not exists public.collection_requests (
  id               uuid        primary key default gen_random_uuid(),
  workspace_id     uuid        not null references public.workspaces(id) on delete cascade,
  recipient_email  text        not null,
  recipient_name   text,
  status           text        not null default 'pending' check (status in ('pending', 'sent', 'completed', 'expired')),
  token            text        unique,
  expires_at       timestamptz,
  created_at       timestamptz not null default now(),
  title            text        not null default 'Share your feedback',
  description      text        not null default 'We''d love to hear about your experience.',
  button_text      text        not null default 'Submit Testimonial',
  thank_you_message text      not null default 'Thanks for your feedback!',
  brand_color      text        not null default '#6366f1',
  field_config     jsonb       not null default '{
    "show_rating": true,
    "show_name": true,
    "name_required": false,
    "show_email": false,
    "email_required": false,
    "show_company": false,
    "company_required": false,
    "show_role": false,
    "role_required": false,
    "show_video": false,
    "min_characters": 10,
    "max_characters": 5000
  }'::jsonb,
  redirect_url     text
);

-- ----------------------------------------------------------------------------
-- 4. INDEXES
-- ----------------------------------------------------------------------------
create index idx_users_stripe_customer_id on public.users(stripe_customer_id);

create index idx_workspaces_user_id    on public.workspaces(user_id);
create index idx_workspaces_slug       on public.workspaces(slug);

create index idx_testimonials_workspace_id on public.testimonials(workspace_id);
create index idx_testimonials_status       on public.testimonials(status);
create index idx_testimonials_tags         on public.testimonials using gin(tags);
create index idx_testimonials_created_at   on public.testimonials(created_at desc);
create index idx_testimonials_source       on public.testimonials(source);
create index idx_testimonials_featured     on public.testimonials(featured);

create index idx_widgets_workspace_id on public.widgets(workspace_id);

create index idx_collections_workspace_id on public.collections(workspace_id);
create index idx_collections_share_url    on public.collections(share_url);

create index idx_collection_requests_workspace_id on public.collection_requests(workspace_id);
create index idx_collection_requests_token        on public.collection_requests(token);
create index idx_collection_requests_status       on public.collection_requests(status);

-- ----------------------------------------------------------------------------
-- 5. UPDATED_AT TRIGGERS
-- ----------------------------------------------------------------------------
create trigger handle_workspaces_updated_at
  before update on public.workspaces
  for each row execute function handle_updated_at();

create trigger handle_testimonials_updated_at
  before update on public.testimonials
  for each row execute function handle_updated_at();

create trigger handle_widgets_updated_at
  before update on public.widgets
  for each row execute function handle_updated_at();

-- ----------------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- ----------------------------------------------------------------------------
alter table public.users              enable row level security;
alter table public.workspaces         enable row level security;
alter table public.testimonials       enable row level security;
alter table public.widgets            enable row level security;
alter table public.collections        enable row level security;
alter table public.collection_requests enable row level security;

-- ----------------------------------------------------------------------------
-- 7. RLS POLICIES
-- ----------------------------------------------------------------------------

-- 7a. USERS
create policy "Users can view own profile"
  on public.users for select
  using (id = auth.uid());

create policy "Users can insert own profile"
  on public.users for insert
  with check (id = auth.uid());

create policy "Users can update own profile"
  on public.users for update
  using (id = auth.uid());

-- 7b. WORKSPACES
create policy "Users can view own workspaces"
  on public.workspaces for select
  using (user_id = auth.uid());

create policy "Users can create workspaces"
  on public.workspaces for insert
  with check (user_id = auth.uid());

create policy "Users can update own workspaces"
  on public.workspaces for update
  using (user_id = auth.uid());

create policy "Users can delete own workspaces"
  on public.workspaces for delete
  using (user_id = auth.uid());

-- 7c. TESTIMONIALS
create policy "Users can view testimonials from own workspaces"
  on public.testimonials for select
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can create testimonials in own workspaces"
  on public.testimonials for insert
  with check (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can update testimonials in own workspaces"
  on public.testimonials for update
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can delete testimonials in own workspaces"
  on public.testimonials for delete
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

-- Public insert for collection-based submission
create policy "Anyone can submit testimonials via collection"
  on public.testimonials for insert
  with check (
    exists (
      select 1 from public.collections
      where collections.id = (metadata ->> 'collection_id')::uuid
    )
  );

-- 7d. WIDGETS
create policy "Users can view widgets from own workspaces"
  on public.widgets for select
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can create widgets in own workspaces"
  on public.widgets for insert
  with check (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can update widgets in own workspaces"
  on public.widgets for update
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can delete widgets in own workspaces"
  on public.widgets for delete
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

-- Allow public read for embedded widgets
create policy "Anyone can read widgets for embed"
  on public.widgets for select
  using (true);

-- 7e. COLLECTIONS
create policy "Users can view collections from own workspaces"
  on public.collections for select
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can create collections in own workspaces"
  on public.collections for insert
  with check (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can update collections in own workspaces"
  on public.collections for update
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can delete collections in own workspaces"
  on public.collections for delete
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

-- Allow public read for shareable collection links
create policy "Anyone can read shared collections"
  on public.collections for select
  using (true);

-- 7f. COLLECTION_REQUESTS
create policy "Users can view collection requests from own workspaces"
  on public.collection_requests for select
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can create collection requests"
  on public.collection_requests for insert
  with check (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can update collection requests"
  on public.collection_requests for update
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

create policy "Users can delete collection requests"
  on public.collection_requests for delete
  using (
    workspace_id in (
      select id from public.workspaces where user_id = auth.uid()
    )
  );

-- ----------------------------------------------------------------------------
-- 8. AUTO-CREATE USER PROFILE ON SIGNUP
-- ----------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 9. PUBLIC COLLECTION FLOW (anon visitors hitting /collect/[token])
-- ----------------------------------------------------------------------------
-- Anon visitors use the anon key, so RLS must explicitly allow them to read
-- active collection links and submit testimonials tied to an active link.
-- Marking a link "completed" is done via a SECURITY DEFINER function (below)
-- so we never grant anon a direct UPDATE on collection_requests.

create policy "Public can view active collection links"
  on public.collection_requests for select
  using (
    token is not null
    and status = 'pending'
    and (expires_at is null or expires_at > now())
  );

create policy "Public can submit testimonials via active collection links"
  on public.testimonials for insert
  with check (
    exists (
      select 1 from public.collection_requests cr
      where cr.token = (metadata ->> 'collection_token')
        and cr.status = 'pending'
        and (cr.expires_at is null or cr.expires_at > now())
        and cr.workspace_id = testimonials.workspace_id
    )
  );

create or replace function public.complete_collection_request(p_token text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.collection_requests
  set status = 'completed'
  where token = p_token
    and status = 'pending';
end;
$$;

grant execute on function public.complete_collection_request(text) to anon, authenticated;

-- ============================================================================
-- 10. PUBLIC EMBED READ ACCESS + SAFE VIEW COUNTER
-- ============================================================================

-- Allow anonymous visitors to read only APPROVED testimonials.
create policy if not exists "Public can read approved testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (status = 'approved');

-- SECURITY DEFINER function so the public embed route can increment the
-- view counter without an anon UPDATE policy on widgets.
create or replace function public.increment_widget_views(p_widget_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.widgets
     set views_count = coalesce(views_count, 0) + 1
   where id = p_widget_id;
$$;

grant execute on function public.increment_widget_views(uuid) to anon, authenticated;
