import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import type { FullInvitation } from "@/features/invitation/types";

/** Like getInvitationBySlug but fetches by event id (owner-gated, works for drafts) */
export async function getInvitationPreview(eventId: string, ownerId: string, superAdmin = false): Promise<FullInvitation | null> {
  const supabase = superAdmin ? createServiceClient() : await createClient();

  let query = supabase
    .from("events")
    .select("id, slug, event_type, title, honoree_names, main_date, timezone, is_published")
    .eq("id", eventId);
  if (!superAdmin) query = query.eq("owner_id", ownerId);

  const { data: event } = await query.single();

  if (!event) return null;

  const [{ data: theme }, { data: sections }, { data: gallery }, { data: schedule }, { data: locations }, { data: rsvp }] =
    await Promise.all([
      supabase.from("event_themes").select("theme_key, palette, typography, block_config, background_image_url, default_background_key").eq("event_id", eventId).single(),
      supabase.from("event_sections").select("section_key, heading, body, display_order").eq("event_id", eventId).order("display_order"),
      supabase.from("event_gallery").select("image_url, caption, display_order").eq("event_id", eventId).order("display_order"),
      supabase.from("event_schedule").select("title, starts_at, ends_at, details, display_order").eq("event_id", eventId).order("display_order"),
      supabase.from("event_locations").select("label, address, maps_url, starts_at, display_order").eq("event_id", eventId).order("display_order"),
      supabase.from("event_rsvp_settings").select("whatsapp_number, message_template, enabled").eq("event_id", eventId).single(),
    ]);

  return {
    event,
    theme: theme ?? { theme_key: "elegant" },
    sections: sections ?? [],
    gallery: gallery ?? [],
    schedule: schedule ?? [],
    locations: locations ?? [],
    rsvp: rsvp ?? { whatsapp_number: "", message_template: "", enabled: false },
  };
}
