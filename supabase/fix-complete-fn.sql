-- SECURITY DEFINER function so a public visitor (anon) can mark a
-- collection link "completed" after submitting, without needing a
-- service-role key and without granting anon direct UPDATE on the table.
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

-- Remove the (broken) direct anon UPDATE RLS policy; only the SECURITY
-- DEFINER function above may change collection_requests status publicly.
drop policy if exists "Public can complete collection links after submit" on public.collection_requests;
