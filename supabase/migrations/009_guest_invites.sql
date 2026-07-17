-- Feature #1: Personalized guest invite links
-- Turns event_guests into a pre-loaded guest list (organizer creates guests up
-- front) with a unique token per guest for links like /i/<slug>?g=<token>.

alter table public.event_guests
  add column if not exists invite_token uuid not null default gen_random_uuid(),
  add column if not exists max_plus_ones int not null default 0,
  add column if not exists email text,
  add column if not exists group_label text,
  add column if not exists viewed_at timestamptz,
  add column if not exists responded_at timestamptz;

-- Existing self-registered guests: cap their allowance at what they declared,
-- and backfill responded_at for anyone who already answered.
update public.event_guests
  set max_plus_ones = plus_ones
  where max_plus_ones = 0 and plus_ones > 0;

update public.event_guests
  set responded_at = created_at
  where responded_at is null and confirmation_status <> 'pending';

-- Unique token index (adding the column with a volatile default already gave
-- each existing row a distinct value).
create unique index if not exists idx_event_guests_invite_token
  on public.event_guests(invite_token);
