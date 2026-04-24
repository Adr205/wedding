-- page_blocks: flexible content blocks for each invitation page
CREATE TABLE page_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  block_type text NOT NULL CHECK (
    block_type IN (
      'hero','countdown','quote','text','photo','gallery',
      'schedule','location','rsvp','divider','dress_code','gift_registry'
    )
  ),
  config jsonb NOT NULL DEFAULT '{}',
  display_order integer NOT NULL DEFAULT 0,
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX page_blocks_event_order_idx ON page_blocks(event_id, display_order);

ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner can manage blocks"
  ON page_blocks
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = page_blocks.event_id
        AND events.owner_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = page_blocks.event_id
        AND events.owner_id = auth.uid()
    )
  );

-- ── Migrate existing data into blocks ──────────────────────────────────────

-- Hero block for every existing event
INSERT INTO page_blocks (event_id, block_type, config, display_order, enabled)
SELECT id, 'hero', '{}', 0, true FROM events;

-- Gallery block from event_gallery (grouped per event)
INSERT INTO page_blocks (event_id, block_type, config, display_order, enabled)
SELECT
  eg.event_id,
  'gallery',
  jsonb_build_object(
    'layout', 'grid',
    'columns', 3,
    'images', jsonb_agg(
      jsonb_build_object('image_url', eg.image_url, 'caption', eg.caption)
      ORDER BY eg.display_order
    )
  ),
  10,
  true
FROM event_gallery eg
GROUP BY eg.event_id;

-- Countdown block for every event
INSERT INTO page_blocks (event_id, block_type, config, display_order, enabled)
SELECT id, 'countdown', '{"style":"numbers"}', 20, true FROM events;

-- Ornament divider for every event
INSERT INTO page_blocks (event_id, block_type, config, display_order, enabled)
SELECT id, 'divider', '{"style":"ornament"}', 25, true FROM events;

-- Text blocks from event_sections
INSERT INTO page_blocks (event_id, block_type, config, display_order, enabled)
SELECT
  event_id,
  'text',
  jsonb_build_object('heading', heading, 'body', body, 'alignment', 'center'),
  30 + display_order,
  true
FROM event_sections;

-- Schedule block from event_schedule (grouped per event)
INSERT INTO page_blocks (event_id, block_type, config, display_order, enabled)
SELECT
  es.event_id,
  'schedule',
  jsonb_build_object(
    'title', 'Itinerario',
    'items', jsonb_agg(
      jsonb_build_object(
        'title', es.title,
        'starts_at', es.starts_at::text,
        'ends_at', es.ends_at::text,
        'details', es.details
      )
      ORDER BY es.display_order
    )
  ),
  50,
  true
FROM event_schedule es
GROUP BY es.event_id;

-- Location blocks from event_locations (one block per location)
INSERT INTO page_blocks (event_id, block_type, config, display_order, enabled)
SELECT
  event_id,
  'location',
  jsonb_build_object(
    'label', label,
    'address', address,
    'maps_url', maps_url,
    'starts_at', starts_at::text,
    'show_map', true
  ),
  60 + display_order,
  true
FROM event_locations;

-- RSVP block for every event
INSERT INTO page_blocks (event_id, block_type, config, display_order, enabled)
SELECT id, 'rsvp', '{}', 70, true FROM events;
