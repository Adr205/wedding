ALTER TABLE page_blocks DROP CONSTRAINT IF EXISTS page_blocks_block_type_check;

ALTER TABLE page_blocks ADD CONSTRAINT page_blocks_block_type_check
  CHECK (block_type IN (
    'hero', 'countdown', 'quote', 'text', 'photo', 'gallery',
    'schedule', 'location', 'hotels', 'parents', 'kids_policy', 'rsvp',
    'divider', 'dress_code', 'gift_registry', 'gift_envelopes',
    'video', 'subevents', 'guestbook', 'guest_gallery', 'grid', 'flex'
  ));
