-- Add animation column to page_blocks
ALTER TABLE page_blocks ADD COLUMN IF NOT EXISTS animation text;
