-- Feature #5: Collaborative post-wedding gallery
-- Guests upload their own photos (behind a QR/link). Uploads land unapproved and
-- the owner moderates. Files go to the existing 'event-media' bucket under
-- guest-uploads/<event_id>/ via a service-client API route.

create table if not exists public.event_uploads (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  uploader_name text,
  image_url text not null,
  storage_path text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_event_uploads_event
  on public.event_uploads(event_id, created_at desc);

alter table public.event_uploads enable row level security;

drop policy if exists "event_uploads_owner_access" on public.event_uploads;
create policy "event_uploads_owner_access"
on public.event_uploads
for all
using (
  exists (
    select 1 from public.events e
    where e.id = event_uploads.event_id and e.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.events e
    where e.id = event_uploads.event_id and e.owner_id = auth.uid()
  )
);

drop policy if exists "event_uploads_public_read" on public.event_uploads;
create policy "event_uploads_public_read"
on public.event_uploads
for select
using (
  approved = true and exists (
    select 1 from public.events e
    where e.id = event_uploads.event_id and e.is_published = true
  )
);
