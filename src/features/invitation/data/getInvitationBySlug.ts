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

  const blockList = blocks ?? [];
  const hasGuestbook = blockList.some((b) => b.block_type === "guestbook");
  const hasGuestGallery = blockList.some((b) => b.block_type === "guest_gallery");

  const [messagesRes, uploadsRes] = await Promise.all([
    hasGuestbook
      ? supabase
          .from("event_messages")
          .select("id, author_name, body, created_at")
          .eq("event_id", event.id)
          .eq("approved", true)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
    hasGuestGallery
      ? supabase
          .from("event_uploads")
          .select("id, uploader_name, image_url, created_at")
          .eq("event_id", event.id)
          .eq("approved", true)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [] }),
  ]);

  return {
    event,
    theme: theme ?? { theme_key: "elegant" },
    blocks: blockList,
    rsvp: rsvp ?? { whatsapp_number: "", message_template: "", enabled: false },
    messages: messagesRes.data ?? [],
    uploads: uploadsRes.data ?? [],
  };
}
