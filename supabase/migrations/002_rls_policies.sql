alter table public.events enable row level security;
alter table public.event_themes enable row level security;
alter table public.event_sections enable row level security;
alter table public.event_gallery enable row level security;
alter table public.event_schedule enable row level security;
alter table public.event_locations enable row level security;
alter table public.event_rsvp_settings enable row level security;
alter table public.event_guests enable row level security;

drop policy if exists "events_owner_full_access" on public.events;
create policy "events_owner_full_access"
on public.events
for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "events_public_read_published" on public.events;
create policy "events_public_read_published"
on public.events
for select
using (is_published = true);

drop policy if exists "event_themes_owner_access" on public.event_themes;
create policy "event_themes_owner_access"
on public.event_themes
for all
using (
  exists (
    select 1
    from public.events e
    where e.id = event_themes.event_id
      and e.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.events e
    where e.id = event_themes.event_id
      and e.owner_id = auth.uid()
  )
);

drop policy if exists "event_sections_owner_access" on public.event_sections;
create policy "event_sections_owner_access"
on public.event_sections
for all
using (
  exists (
    select 1 from public.events e
    where e.id = event_sections.event_id and e.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.events e
    where e.id = event_sections.event_id and e.owner_id = auth.uid()
  )
);

drop policy if exists "event_gallery_owner_access" on public.event_gallery;
create policy "event_gallery_owner_access"
on public.event_gallery
for all
using (
  exists (
    select 1 from public.events e
    where e.id = event_gallery.event_id and e.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.events e
    where e.id = event_gallery.event_id and e.owner_id = auth.uid()
  )
);

drop policy if exists "event_schedule_owner_access" on public.event_schedule;
create policy "event_schedule_owner_access"
on public.event_schedule
for all
using (
  exists (
    select 1 from public.events e
    where e.id = event_schedule.event_id and e.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.events e
    where e.id = event_schedule.event_id and e.owner_id = auth.uid()
  )
);

drop policy if exists "event_locations_owner_access" on public.event_locations;
create policy "event_locations_owner_access"
on public.event_locations
for all
using (
  exists (
    select 1 from public.events e
    where e.id = event_locations.event_id and e.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.events e
    where e.id = event_locations.event_id and e.owner_id = auth.uid()
  )
);

drop policy if exists "event_rsvp_owner_access" on public.event_rsvp_settings;
create policy "event_rsvp_owner_access"
on public.event_rsvp_settings
for all
using (
  exists (
    select 1 from public.events e
    where e.id = event_rsvp_settings.event_id and e.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.events e
    where e.id = event_rsvp_settings.event_id and e.owner_id = auth.uid()
  )
);

drop policy if exists "event_guests_owner_access" on public.event_guests;
create policy "event_guests_owner_access"
on public.event_guests
for all
using (
  exists (
    select 1 from public.events e
    where e.id = event_guests.event_id and e.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.events e
    where e.id = event_guests.event_id and e.owner_id = auth.uid()
  )
);

drop policy if exists "public_theme_read" on public.event_themes;
create policy "public_theme_read"
on public.event_themes
for select
using (
  exists (
    select 1 from public.events e
    where e.id = event_themes.event_id and e.is_published = true
  )
);

drop policy if exists "public_sections_read" on public.event_sections;
create policy "public_sections_read"
on public.event_sections
for select
using (
  exists (
    select 1 from public.events e
    where e.id = event_sections.event_id and e.is_published = true
  )
);

drop policy if exists "public_gallery_read" on public.event_gallery;
create policy "public_gallery_read"
on public.event_gallery
for select
using (
  exists (
    select 1 from public.events e
    where e.id = event_gallery.event_id and e.is_published = true
  )
);

drop policy if exists "public_schedule_read" on public.event_schedule;
create policy "public_schedule_read"
on public.event_schedule
for select
using (
  exists (
    select 1 from public.events e
    where e.id = event_schedule.event_id and e.is_published = true
  )
);

drop policy if exists "public_locations_read" on public.event_locations;
create policy "public_locations_read"
on public.event_locations
for select
using (
  exists (
    select 1 from public.events e
    where e.id = event_locations.event_id and e.is_published = true
  )
);

drop policy if exists "public_rsvp_read" on public.event_rsvp_settings;
create policy "public_rsvp_read"
on public.event_rsvp_settings
for select
using (
  exists (
    select 1 from public.events e
    where e.id = event_rsvp_settings.event_id and e.is_published = true
  )
);
