import { z } from "zod";

const pageBlockSchema = z.object({
  id: z.string().optional(),
  block_type: z.enum([
    "hero", "countdown", "quote", "text", "photo", "gallery",
    "schedule", "location", "rsvp", "divider", "dress_code", "gift_registry",
    "video", "grid", "flex",
  ]),
  config: z.record(z.string(), z.unknown()),
  display_order: z.number().int().nonnegative().default(0),
  enabled: z.boolean().default(true),
  animation: z.enum(["none", "fade", "slide-up", "slide-left", "slide-right", "zoom"]).nullish(),
});

export const eventFormSchema = z.object({
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/),
  event_type: z.enum(["wedding", "xv", "other"]),
  title: z.string().min(3),
  honoree_names: z.string().min(3),
  main_date: z.string().datetime(),
  timezone: z.string().min(2),
  is_published: z.boolean().default(false),
  theme_key: z.string().min(2),
  font_heading: z.string().optional().default("Playfair Display"),
  background_image_url: z.string().url().optional().nullable(),
  default_background_key: z.string().optional().nullable(),
  // Color overrides (stored in event_themes.palette)
  text_color: z.string().optional().nullable(),
  card_bg: z.string().optional().nullable(),
  whatsapp_number: z.string().min(8),
  message_template: z.string().min(5),
  blocks: z.array(pageBlockSchema).default([]),
});

export type EventFormInput = z.infer<typeof eventFormSchema>;
