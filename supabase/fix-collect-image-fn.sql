create or replace function public.submit_collect_widget_testimonial(
  p_widget_id uuid,
  p_author_name text,
  p_author_email text default null,
  p_author_image text default null,
  p_author_company text default null,
  p_author_role text default null,
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
  select workspace_id, auto_approve_5star into v_workspace_id, v_auto_approve
  from public.collect_widgets
  where id = p_widget_id and is_active = true;

  if v_workspace_id is null then
    return jsonb_build_object('error', 'Widget not found or inactive');
  end if;

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

  v_status := 'pending';
  if v_auto_approve and p_rating is not null and p_rating >= 5 then
    v_status := 'approved';
  end if;

  insert into public.testimonials (
    workspace_id, author_name, author_email, author_image, author_company, author_role,
    content, rating, source, status, metadata
  ) values (
    v_workspace_id, p_author_name, p_author_email, p_author_image, p_author_company, p_author_role,
    p_content, p_rating, 'email', v_status,
    jsonb_build_object(
      'collect_widget_id', p_widget_id,
      'page_url', p_page_url,
      'referrer', p_referrer
    )
  );

  if p_ip_address is not null then
    insert into public.submission_ips (workspace_id, ip_address)
    values (v_workspace_id, p_ip_address);
  end if;

  update public.collect_widgets
  set submission_count = submission_count + 1
  where id = p_widget_id;

  return jsonb_build_object('success', true, 'status', v_status);
end;
$$;
