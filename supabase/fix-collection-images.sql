-- Storage bucket + policy for collection link images.
insert into storage.buckets (id, name, public)
values ('collection-images', 'collection-images', true)
on conflict (id) do update set public = true;

create policy "Public can upload collection images"
  on storage.objects for insert
  with check (bucket_id = 'collection-images');

create policy "Public can read collection images"
  on storage.objects for select
  using (bucket_id = 'collection-images');
