-- Add background image and font fields to event_themes
alter table public.event_themes
  add column if not exists background_image_url text,
  add column if not exists default_background_key text;
