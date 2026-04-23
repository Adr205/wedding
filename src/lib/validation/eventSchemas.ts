import { z } from "zod";

export const sectionSchema = z.object({
  section_key: z.string().min(2),
  heading: z.string().min(2),
  body: z.string().min(2),
  display_order: z.number().int().nonnegative().default(0),
});

export const galleryItemSchema = z.object({
  image_url: z.string().url(),
  caption: z.string().optional().nullable(),
  display_order: z.number().int().nonnegative().default(0),
});

export const scheduleItemSchema = z.object({
  title: z.string().min(2),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime().optional().nullable(),
  details: z.string().optional().nullable(),
  display_order: z.number().int().nonnegative().default(0),
});

export const locationItemSchema = z.object({
  label: z.string().min(2),
  address: z.string().min(4),
  maps_url: z.string().url().optional().nullable(),
  starts_at: z.string().datetime().optional().nullable(),
  display_order: z.number().int().nonnegative().default(0),
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
  whatsapp_number: z.string().min(8),
  message_template: z.string().min(5),
  sections: z.array(sectionSchema).default([]),
  gallery: z.array(galleryItemSchema).default([]),
  schedule: z.array(scheduleItemSchema).default([]),
  locations: z.array(locationItemSchema).default([]),
});

export type EventFormInput = z.infer<typeof eventFormSchema>;
