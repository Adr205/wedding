-- Features #4 & #5: allow the 'guestbook' and 'guest_gallery' block types.
ALTER TABLE page_blocks DROP CONSTRAINT IF EXISTS page_blocks_block_type_check;

ALTER TABLE page_blocks ADD CONSTRAINT page_blocks_block_type_check
  CHECK (block_type IN (
    'hero', 'countdown', 'quote', 'text', 'photo', 'gallery',
    'schedule', 'location', 'rsvp', 'divider', 'dress_code', 'gift_registry',
    'video', 'subevents', 'guestbook', 'guest_gallery', 'grid', 'flex'
  ));
