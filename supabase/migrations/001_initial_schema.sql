create extension if not exists "pgcrypto";

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  slug text not null unique,
  event_type text not null check (event_type in ('wedding', 'xv', 'other')),
  title text not null,
  honoree_names text not null,
  main_date timestamptz not null,
  timezone text not null default 'America/Mexico_City',
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.event_themes (
  event_id uuid primary key references public.events(id) on delete cascade,
  theme_key text not null,
  palette jsonb not null default '{}'::jsonb,
  typography jsonb not null default '{}'::jsonb,
  block_config jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.event_sections (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  section_key text not null,
  heading text not null,
  body text not null,
  display_order int not null default 0,
  unique(event_id, section_key)
);

create table if not exists public.event_gallery (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  image_url text not null,
  caption text,
  display_order int not null default 0
);

create table if not exists public.event_schedule (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  details text,
  display_order int not null default 0
);

create table if not exists public.event_locations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  label text not null,
  address text not null,
  maps_url text,
  starts_at timestamptz,
  display_order int not null default 0
);

create table if not exists public.event_rsvp_settings (
  event_id uuid primary key references public.events(id) on delete cascade,
  whatsapp_number text not null,
  message_template text not null,
  enabled boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.event_guests (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  guest_name text not null,
  guest_phone text,
  plus_ones int not null default 0,
  confirmation_status text not null default 'pending' check (confirmation_status in ('pending', 'confirmed', 'declined')),
  created_at timestamptz not null default now()
);

create index if not exists idx_events_owner_id on public.events(owner_id);
create index if not exists idx_events_slug on public.events(slug);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_events_updated_at on public.events;
create trigger trg_events_updated_at
before update on public.events
for each row
execute function public.set_updated_at();
