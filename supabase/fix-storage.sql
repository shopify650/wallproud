-- Storage bucket + policy for testimonial video uploads.
-- The CollectForm records video and uploads to this bucket as anon, so the
-- bucket must exist and anon must be allowed to INSERT objects into it.
insert into storage.buckets (id, name, public)
values ('testimonial-videos', 'testimonial-videos', true)
on conflict (id) do update set public = true;

create policy "Public can upload testimonial videos"
  on storage.objects for insert
  with check (bucket_id = 'testimonial-videos');

create policy "Public can read testimonial videos"
  on storage.objects for select
  using (bucket_id = 'testimonial-videos');
