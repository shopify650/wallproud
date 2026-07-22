-- Storage bucket + policy for testimonial images.
insert into storage.buckets (id, name, public)
values ('testimonial-images', 'testimonial-images', true)
on conflict (id) do update set public = true;

create policy "Public can upload testimonial images"
  on storage.objects for insert
  with check (bucket_id = 'testimonial-images');

create policy "Public can read testimonial images"
  on storage.objects for select
  using (bucket_id = 'testimonial-images');
