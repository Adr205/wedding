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

  const [{ data: theme }, { data: blocks }, { data: rsvp }] = await Promise.all([
    supabase
      .from("event_themes")
      .select("theme_key, palette, typography, block_config, background_image_url, default_background_key")
      .eq("event_id", event.id)
      .single(),
    supabase
      .from("page_blocks")
      .select("id, block_type, config, display_order, enabled, animation")
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
    blocks: blocks ?? [],
    rsvp: rsvp ?? { whatsapp_number: "", message_template: "", enabled: false },
  };
}
