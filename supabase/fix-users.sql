-- Reconcile the pre-existing public.users table to match the app's expected schema.
-- The table already existed (with `name` + `metadata_json`) so our
-- `create table if not exists` was skipped, and the auth trigger failed.

-- Rename `name` -> `full_name` (app code + trigger expect `full_name`)
alter table public.users rename column name to full_name;

-- Add the missing `avatar_url` column the trigger inserts into
alter table public.users add column if not exists avatar_url text;

-- Ensure stripe columns exist (idempotent)
alter table public.users add column if not exists stripe_customer_id text;
alter table public.users add column if not exists stripe_subscription_id text;

-- Drop the legacy `metadata_json` column if present (not used by the app)
alter table public.users drop column if exists metadata_json;

-- Recreate the trigger function defensively so it matches the columns
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
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Ensure the trigger is attached (idempotent)
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
