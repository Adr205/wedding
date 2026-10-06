-- page_blocks only had the owner policy (006), so the public invitation page
-- (/i/[slug]) received zero blocks for anyone who is not the event owner.
drop policy if exists "public_blocks_read" on public.page_blocks;
create policy "public_blocks_read"
on public.page_blocks
for select
using (
  exists (
    select 1 from public.events e
    where e.id = page_blocks.event_id and e.is_published = true
  )
);
