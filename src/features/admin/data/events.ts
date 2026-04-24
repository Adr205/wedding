import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import { eventFormSchema, type EventFormInput } from "@/lib/validation/eventSchemas";

const EVENT_SELECT = "id, slug, event_type, title, honoree_names, main_date, timezone, is_published";
const EVENT_SELECT_WITH_OWNER = "id, slug, event_type, title, honoree_names, main_date, timezone, is_published, owner_id";

export async function listEvents(ownerId: string, superAdmin = false) {
  const supabase = await createClient();
  let query = supabase.from("events").select(EVENT_SELECT_WITH_OWNER).order("created_at", { ascending: false });
  if (!superAdmin) query = query.eq("owner_id", ownerId);

  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function getEventBundle(eventId: string, ownerId: string, superAdmin = false) {
  const supabase = superAdmin ? createServiceClient() : await createClient();

  let query = supabase.from("events").select(EVENT_SELECT).eq("id", eventId);
  if (!superAdmin) query = query.eq("owner_id", ownerId);

  const { data: event } = await query.single();
  if (!event) return null;

  const [{ data: theme }, { data: blocks }, { data: rsvp }] = await Promise.all([
    supabase
      .from("event_themes")
      .select("theme_key, palette, typography, background_image_url, default_background_key")
      .eq("event_id", eventId)
      .single(),
    supabase
      .from("page_blocks")
      .select("id, block_type, config, display_order, enabled, animation")
      .eq("event_id", eventId)
      .order("display_order"),
    supabase
      .from("event_rsvp_settings")
      .select("whatsapp_number, message_template")
      .eq("event_id", eventId)
      .single(),
  ]);

  const palette = theme?.palette as Record<string, string> | null;

  return {
    ...event,
    theme_key: theme?.theme_key ?? "elegant",
    font_heading: (theme?.typography as Record<string, string> | null)?.heading ?? "Playfair Display",
    background_image_url: theme?.background_image_url ?? null,
    default_background_key: theme?.default_background_key ?? null,
    text_color: palette?.text ?? null,
    card_bg: palette?.card_bg ?? null,
    whatsapp_number: rsvp?.whatsapp_number ?? "",
    message_template: rsvp?.message_template ?? "Hola, confirmo mi asistencia a {{eventTitle}}.",
    blocks: blocks ?? [],
  };
}

export async function saveEventBundle(ownerId: string, payload: unknown, eventId?: string, superAdmin = false) {
  const parsed = eventFormSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, message: "Datos inválidos", issues: parsed.error.flatten() };
  }

  const data = parsed.data;
  const supabase = (eventId && superAdmin) ? createServiceClient() : await createClient();

  const eventFields = {
    slug: data.slug,
    event_type: data.event_type,
    title: data.title,
    honoree_names: data.honoree_names,
    main_date: data.main_date,
    timezone: data.timezone,
    is_published: data.is_published,
  };

  let upsertEvent;
  if (eventId) {
    let q = supabase.from("events").update(eventFields).eq("id", eventId);
    if (!superAdmin) q = q.eq("owner_id", ownerId);
    upsertEvent = await q.select("id").single();
  } else {
    upsertEvent = await supabase
      .from("events")
      .insert({ ...eventFields, owner_id: ownerId })
      .select("id")
      .single();
  }

  if (upsertEvent.error || !upsertEvent.data) {
    return { ok: false, message: upsertEvent.error?.message ?? "No se pudo guardar el evento" };
  }

  const savedEventId = upsertEvent.data.id;

  await Promise.all([
    supabase.from("event_themes").upsert({
      event_id: savedEventId,
      theme_key: data.theme_key,
      typography: { heading: data.font_heading ?? "Playfair Display" },
      background_image_url: data.background_image_url ?? null,
      default_background_key: data.default_background_key ?? null,
      palette: {
        ...(data.text_color ? { text: data.text_color } : {}),
        ...(data.card_bg ? { card_bg: data.card_bg } : {}),
      },
    }),
    supabase.from("event_rsvp_settings").upsert({
      event_id: savedEventId,
      whatsapp_number: data.whatsapp_number,
      message_template: data.message_template,
      enabled: true,
    }),
  ]);

  // Delete + reinsert page_blocks
  await supabase.from("page_blocks").delete().eq("event_id", savedEventId);

  if (data.blocks.length > 0) {
    await supabase.from("page_blocks").insert(
      data.blocks.map((block, i) => ({
        event_id: savedEventId,
        block_type: block.block_type,
        config: block.config,
        display_order: i,
        enabled: block.enabled,
        animation: block.animation ?? null,
      })),
    );
  }

  return { ok: true, eventId: savedEventId };
}

export async function listEventGuests(eventId: string, ownerId: string, superAdmin = false) {
  const supabase = superAdmin ? createServiceClient() : await createClient();

  if (!superAdmin) {
    const { data: event } = await supabase
      .from("events")
      .select("id")
      .eq("id", eventId)
      .eq("owner_id", ownerId)
      .single();
    if (!event) return [];
  }

  const { data } = await supabase
    .from("event_guests")
    .select("id, guest_name, guest_phone, plus_ones, confirmation_status, created_at")
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export function getDraftEventDefaults(): EventFormInput {
  return {
    slug: "",
    event_type: "wedding",
    title: "",
    honoree_names: "",
    main_date: new Date().toISOString(),
    timezone: "America/Mexico_City",
    is_published: false,
    theme_key: "elegant",
    font_heading: "Playfair Display",
    background_image_url: null,
    default_background_key: null,
    whatsapp_number: "52",
    message_template: "Hola, confirmo mi asistencia a {{eventTitle}}.",
    blocks: [
      { block_type: "hero", config: {}, display_order: 0, enabled: true },
      { block_type: "countdown", config: { style: "numbers" }, display_order: 10, enabled: true },
      { block_type: "divider", config: { style: "ornament" }, display_order: 20, enabled: true },
      { block_type: "rsvp", config: {}, display_order: 30, enabled: true },
    ],
  };
}
