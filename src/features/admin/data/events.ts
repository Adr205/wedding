import { createClient } from "@/lib/supabase/server";
import { eventFormSchema, type EventFormInput } from "@/lib/validation/eventSchemas";

const EVENT_SELECT = "id, slug, event_type, title, honoree_names, main_date, timezone, is_published";

export async function listEvents(ownerId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });

  if (error) {
    return [];
  }

  return data ?? [];
}

export async function getEventBundle(eventId: string, ownerId: string) {
  const supabase = await createClient();

  const { data: event } = await supabase
    .from("events")
    .select(EVENT_SELECT)
    .eq("id", eventId)
    .eq("owner_id", ownerId)
    .single();
  if (!event) return null;

  const [{ data: theme }, { data: sections }, { data: gallery }, { data: schedule }, { data: locations }, { data: rsvp }] =
    await Promise.all([
      supabase.from("event_themes").select("theme_key").eq("event_id", eventId).single(),
      supabase.from("event_sections").select("section_key, heading, body, display_order").eq("event_id", eventId).order("display_order"),
      supabase.from("event_gallery").select("image_url, caption, display_order").eq("event_id", eventId).order("display_order"),
      supabase
        .from("event_schedule")
        .select("title, starts_at, ends_at, details, display_order")
        .eq("event_id", eventId)
        .order("display_order"),
      supabase
        .from("event_locations")
        .select("label, address, maps_url, starts_at, display_order")
        .eq("event_id", eventId)
        .order("display_order"),
      supabase
        .from("event_rsvp_settings")
        .select("whatsapp_number, message_template")
        .eq("event_id", eventId)
        .single(),
    ]);

  return {
    ...event,
    theme_key: theme?.theme_key ?? "elegant",
    whatsapp_number: rsvp?.whatsapp_number ?? "",
    message_template: rsvp?.message_template ?? "Hola, confirmo mi asistencia a {{eventTitle}}.",
    sections: sections ?? [],
    gallery: gallery ?? [],
    schedule: schedule ?? [],
    locations: locations ?? [],
  };
}

export async function saveEventBundle(ownerId: string, payload: unknown, eventId?: string) {
  const parsed = eventFormSchema.safeParse(payload);
  if (!parsed.success) {
    return { ok: false, message: "Datos inválidos", issues: parsed.error.flatten() };
  }

  const data = parsed.data;
  const supabase = await createClient();

  const baseEvent = {
    owner_id: ownerId,
    slug: data.slug,
    event_type: data.event_type,
    title: data.title,
    honoree_names: data.honoree_names,
    main_date: data.main_date,
    timezone: data.timezone,
    is_published: data.is_published,
  };

  const upsertEvent = eventId
    ? await supabase.from("events").update(baseEvent).eq("id", eventId).eq("owner_id", ownerId).select("id").single()
    : await supabase.from("events").insert(baseEvent).select("id").single();

  if (upsertEvent.error || !upsertEvent.data) {
    return { ok: false, message: upsertEvent.error?.message ?? "No se pudo guardar el evento" };
  }

  const savedEventId = upsertEvent.data.id;

  await Promise.all([
    supabase.from("event_themes").upsert({ event_id: savedEventId, theme_key: data.theme_key }),
    supabase
      .from("event_rsvp_settings")
      .upsert({
        event_id: savedEventId,
        whatsapp_number: data.whatsapp_number,
        message_template: data.message_template,
        enabled: true,
      }),
  ]);

  await Promise.all([
    supabase.from("event_sections").delete().eq("event_id", savedEventId),
    supabase.from("event_gallery").delete().eq("event_id", savedEventId),
    supabase.from("event_schedule").delete().eq("event_id", savedEventId),
    supabase.from("event_locations").delete().eq("event_id", savedEventId),
  ]);

  if (data.sections.length > 0) {
    await supabase.from("event_sections").insert(data.sections.map((item) => ({ ...item, event_id: savedEventId })));
  }
  if (data.gallery.length > 0) {
    await supabase.from("event_gallery").insert(data.gallery.map((item) => ({ ...item, event_id: savedEventId })));
  }
  if (data.schedule.length > 0) {
    await supabase.from("event_schedule").insert(data.schedule.map((item) => ({ ...item, event_id: savedEventId })));
  }
  if (data.locations.length > 0) {
    await supabase.from("event_locations").insert(data.locations.map((item) => ({ ...item, event_id: savedEventId })));
  }

  return { ok: true, eventId: savedEventId };
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
    whatsapp_number: "52",
    message_template: "Hola, confirmo mi asistencia a {{eventTitle}}.",
    sections: [],
    gallery: [],
    schedule: [],
    locations: [],
  };
}
