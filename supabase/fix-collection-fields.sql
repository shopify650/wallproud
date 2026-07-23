alter table public.collection_requests
  add column if not exists logo_image text,
  add column if not exists show_powered_by boolean not null default true;
