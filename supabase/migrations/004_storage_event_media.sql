-- Create public storage bucket for event media (gallery images, background images)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'event-media',
  'event-media',
  true,
  10485760, -- 10 MB per file
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

-- Only authenticated users can upload (handled by service role key in API route)
-- Public can read (bucket is public)
create policy "public_read_event_media"
  on storage.objects for select
  using (bucket_id = 'event-media');

create policy "auth_upload_event_media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'event-media');

create policy "auth_delete_own_event_media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'event-media' and (storage.foldername(name))[1] = auth.uid()::text);
