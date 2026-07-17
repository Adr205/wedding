import { z } from "zod";

// ── Admin: create / edit a guest ────────────────────────────────────────────

export const guestInputSchema = z.object({
  guest_name: z.string().trim().min(2).max(100),
  max_plus_ones: z.number().int().min(0).max(20).default(0),
  guest_phone: z.string().trim().max(20).optional().nullable(),
  email: z.string().trim().email().max(120).optional().nullable().or(z.literal("")),
  group_label: z.string().trim().max(60).optional().nullable(),
});

export type GuestInput = z.infer<typeof guestInputSchema>;

// Bulk create: one guest per line ("Name" or "Name, plusOnes")
export const guestBulkSchema = z.object({
  names: z.array(z.string().trim().min(2).max(100)).min(1).max(500),
  max_plus_ones: z.number().int().min(0).max(20).default(0),
  group_label: z.string().trim().max(60).optional().nullable(),
});

export type GuestBulkInput = z.infer<typeof guestBulkSchema>;

// Patch: any subset of guest fields, plus optional table assignment
export const guestPatchSchema = guestInputSchema.partial().extend({
  table_id: z.string().uuid().nullable().optional(),
});
export type GuestPatch = z.infer<typeof guestPatchSchema>;

// ── Public: RSVP with optional personalized token ───────────────────────────

export const publicRsvpSchema = z.object({
  slug: z.string().min(1),
  token: z.string().uuid().optional(),
  name: z.string().trim().min(2).max(100),
  phone: z.string().trim().max(20).optional().nullable(),
  plus_ones: z.number().int().min(0).max(20).default(0),
  attending: z.boolean().default(true),
  // Honeypot: real users never fill this. Bots do.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type PublicRsvpInput = z.infer<typeof publicRsvpSchema>;
