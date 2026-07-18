-- ============================================================================
-- Public (anon) read access for embedded testimonials + safe view counter
-- The embed script now uses the ANON key only (no service role in the
-- public edge route). It needs to read approved testimonials, and to bump
-- views_count without being granted UPDATE on widgets.
-- ============================================================================

-- Allow anonymous visitors to read only APPROVED testimonials.
create policy if not exists "Public can read approved testimonials"
  on public.testimonials for select
  to anon, authenticated
  using (status = 'approved');

-- SECURITY DEFINER function so the public embed route can increment the
-- view counter without an anon UPDATE policy on widgets (no RLS bypass for
-- reads, no open write surface).
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
