-- Feature #2: Seating chart (table distribution)
-- Tables belong to an event; guests get an optional table assignment. Guests
-- can be assigned regardless of confirmation status (people may confirm through
-- other channels), so assignment is never gated on confirmation_status.

create table if not exists public.event_tables (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  name text not null,
  capacity int not null default 8 check (capacity between 1 and 60),
  shape text not null default 'round' check (shape in ('round', 'rect')),
  pos_x int not null default 0,
  pos_y int not null default 0,
  display_order int not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_event_tables_event on public.event_tables(event_id, display_order);

alter table public.event_guests
  add column if not exists table_id uuid references public.event_tables(id) on delete set null;

create index if not exists idx_event_guests_table on public.event_guests(table_id);

-- ── RLS ─────────────────────────────────────────────────────────────────────
alter table public.event_tables enable row level security;

drop policy if exists "event_tables_owner_access" on public.event_tables;
create policy "event_tables_owner_access"
on public.event_tables
for all
using (
  exists (
    select 1 from public.events e
    where e.id = event_tables.event_id and e.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.events e
    where e.id = event_tables.event_id and e.owner_id = auth.uid()
  )
);
