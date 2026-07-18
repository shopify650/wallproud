-- ---------------------------------------------------------------------------
-- Fix the PUBLIC collection flow.
-- Public visitors hitting /collect/[token] use the anon key, so RLS must
-- explicitly allow them to:
--   1) READ active collection links (so the form can render)
--   2) SUBMIT a testimonial tied to an active collection link
--   3) MARK a collection link "completed" after a submission
-- Without these, every public submission is blocked and the link shows
-- "Link not found" / fails silently.
-- ---------------------------------------------------------------------------

-- 1) Public read of active collection links
drop policy if exists "Public can view active collection links" on public.collection_requests;
create policy "Public can view active collection links"
  on public.collection_requests for select
  using (
    token is not null
    and status = 'pending'
    and (expires_at is null or expires_at > now())
  );

-- 2) Public submission of testimonials via an active collection link.
-- The inserted row must carry metadata.collection_token matching an active
-- request, and its workspace_id must match that request's workspace.
drop policy if exists "Public can submit testimonials via active collection links" on public.testimonials;
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

-- NOTE: marking a collection link "completed" after submission is handled by
-- the SECURITY DEFINER function public.complete_collection_request(p_token)
-- (see fix-complete-fn.sql). We intentionally do NOT grant anon a direct
-- UPDATE policy on collection_requests.
