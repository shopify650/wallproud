alter table public.collect_widgets
  add column if not exists show_image boolean not null default false;
