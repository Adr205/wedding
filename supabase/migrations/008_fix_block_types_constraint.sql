-- Drop the old CHECK constraint and recreate it including video, grid, flex
ALTER TABLE page_blocks DROP CONSTRAINT IF EXISTS page_blocks_block_type_check;

ALTER TABLE page_blocks ADD CONSTRAINT page_blocks_block_type_check
  CHECK (block_type IN (
    'hero', 'countdown', 'quote', 'text', 'photo', 'gallery',
    'schedule', 'location', 'rsvp', 'divider', 'dress_code', 'gift_registry',
    'video', 'grid', 'flex'
  ));
