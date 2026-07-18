-- Feature #4: Guestbook (libro de mensajes)
-- Guests leave a message for the couple. Public submissions land unapproved and
-- the owner moderates. Public inserts go through a service-client API route, so
-- no public insert policy is needed — only owner-manage and public-read-approved.

create table if not exists public.event_messages (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  guest_id uuid references public.event_guests(id) on delete set null,
  author_name text not null,
  body text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_event_messages_event
  on public.event_messages(event_id, created_at desc);

alter table public.event_messages enable row level security;

drop policy if exists "event_messages_owner_access" on public.event_messages;
create policy "event_messages_owner_access"
on public.event_messages
for all
using (
  exists (
    select 1 from public.events e
    where e.id = event_messages.event_id and e.owner_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.events e
    where e.id = event_messages.event_id and e.owner_id = auth.uid()
  )
);

drop policy if exists "event_messages_public_read" on public.event_messages;
create policy "event_messages_public_read"
on public.event_messages
for select
using (
  approved = true and exists (
    select 1 from public.events e
    where e.id = event_messages.event_id and e.is_published = true
  )
);
