import { createClient } from "@/lib/supabase/server";
import type { FullInvitation } from "@/features/invitation/types";

export async function getInvitationBySlug(slug: string): Promise<FullInvitation | null> {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select("id, slug, event_type, title, honoree_names, main_date, timezone, is_published")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!event) return null;

  const [{ data: theme }, { data: sections }, { data: gallery }, { data: schedule }, { data: locations }, { data: rsvp }] =
    await Promise.all([
      supabase.from("event_themes").select("theme_key, palette, typography, block_config").eq("event_id", event.id).single(),
      supabase.from("event_sections").select("section_key, heading, body, display_order").eq("event_id", event.id).order("display_order"),
      supabase.from("event_gallery").select("image_url, caption, display_order").eq("event_id", event.id).order("display_order"),
      supabase
        .from("event_schedule")
        .select("title, starts_at, ends_at, details, display_order")
        .eq("event_id", event.id)
        .order("display_order"),
      supabase
        .from("event_locations")
        .select("label, address, maps_url, starts_at, display_order")
        .eq("event_id", event.id)
        .order("display_order"),
      supabase
        .from("event_rsvp_settings")
        .select("whatsapp_number, message_template, enabled")
        .eq("event_id", event.id)
        .single(),
    ]);

  return {
    event,
    theme: theme ?? { theme_key: "elegant" },
    sections: sections ?? [],
    gallery: gallery ?? [],
    schedule: schedule ?? [],
    locations: locations ?? [],
    rsvp: rsvp ?? {
      whatsapp_number: "",
      message_template: "Hola, confirmo mi asistencia a {{eventTitle}}.",
      enabled: false,
    },
  };
}
