-- Feature #3: Multi-event / sub-events block
-- Allow the new 'subevents' block type (civil · religiosa · fiesta) which stores
-- its data in page_blocks.config, consistent with the other content blocks.

ALTER TABLE page_blocks DROP CONSTRAINT IF EXISTS page_blocks_block_type_check;

ALTER TABLE page_blocks ADD CONSTRAINT page_blocks_block_type_check
  CHECK (block_type IN (
    'hero', 'countdown', 'quote', 'text', 'photo', 'gallery',
    'schedule', 'location', 'rsvp', 'divider', 'dress_code', 'gift_registry',
    'video', 'subevents', 'grid', 'flex'
  ));
