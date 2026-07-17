import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import {
  guestBulkSchema,
  guestInputSchema,
  guestPatchSchema,
} from "@/lib/validation/guestSchemas";

const GUEST_SELECT =
  "id, guest_name, guest_phone, email, group_label, plus_ones, max_plus_ones, confirmation_status, invite_token, viewed_at, responded_at, created_at, table_id";

export type EventGuest = {
  id: string;
  guest_name: string;
  guest_phone: string | null;
  email: string | null;
  group_label: string | null;
  plus_ones: number;
  max_plus_ones: number;
  confirmation_status: "pending" | "confirmed" | "declined";
  invite_token: string;
  viewed_at: string | null;
  responded_at: string | null;
  created_at: string;
  table_id: string | null;
};

function db(superAdmin: boolean) {
  return superAdmin ? createServiceClient() : createClient();
}

/** Verify the event belongs to the owner (superAdmin skips the check). */
async function assertOwnsEvent(eventId: string, ownerId: string, superAdmin: boolean) {
  if (superAdmin) return true;
  const supabase = await createClient();
  const { data } = await supabase
    .from("events")
    .select("id")
    .eq("id", eventId)
    .eq("owner_id", ownerId)
    .single();
  return Boolean(data);
}

export async function listGuests(
  eventId: string,
  ownerId: string,
  superAdmin = false,
): Promise<EventGuest[]> {
  if (!(await assertOwnsEvent(eventId, ownerId, superAdmin))) return [];
  const supabase = await db(superAdmin);
  const { data } = await supabase
    .from("event_guests")
    .select(GUEST_SELECT)
    .eq("event_id", eventId)
    .order("created_at", { ascending: false });
  return (data as EventGuest[]) ?? [];
}

export async function createGuest(
  eventId: string,
  ownerId: string,
  payload: unknown,
  superAdmin = false,
) {
  const parsed = guestInputSchema.safeParse(payload);
  if (!parsed.success) return { ok: false as const, message: "Datos inválidos" };
  if (!(await assertOwnsEvent(eventId, ownerId, superAdmin)))
    return { ok: false as const, message: "No autorizado" };

  const supabase = await db(superAdmin);
  const { data, error } = await supabase
    .from("event_guests")
    .insert({
      event_id: eventId,
      guest_name: parsed.data.guest_name,
      guest_phone: parsed.data.guest_phone || null,
      email: parsed.data.email || null,
      group_label: parsed.data.group_label || null,
      max_plus_ones: parsed.data.max_plus_ones,
      confirmation_status: "pending",
    })
    .select(GUEST_SELECT)
    .single();

  if (error || !data) return { ok: false as const, message: "No se pudo crear el invitado" };
  return { ok: true as const, guest: data as EventGuest };
}

export async function bulkCreateGuests(
  eventId: string,
  ownerId: string,
  payload: unknown,
  superAdmin = false,
) {
  const parsed = guestBulkSchema.safeParse(payload);
  if (!parsed.success) return { ok: false as const, message: "Datos inválidos" };
  if (!(await assertOwnsEvent(eventId, ownerId, superAdmin)))
    return { ok: false as const, message: "No autorizado" };

  const supabase = await db(superAdmin);
  const rows = parsed.data.names.map((name) => ({
    event_id: eventId,
    guest_name: name,
    group_label: parsed.data.group_label || null,
    max_plus_ones: parsed.data.max_plus_ones,
    confirmation_status: "pending",
  }));

  const { data, error } = await supabase
    .from("event_guests")
    .insert(rows)
    .select(GUEST_SELECT);

  if (error || !data) return { ok: false as const, message: "No se pudieron crear los invitados" };
  return { ok: true as const, guests: data as EventGuest[] };
}

export async function updateGuest(
  guestId: string,
  _ownerId: string,
  payload: unknown,
  superAdmin = false,
) {
  const parsed = guestPatchSchema.safeParse(payload);
  if (!parsed.success) return { ok: false as const, message: "Datos inválidos" };

  const supabase = await db(superAdmin);
  const patch: Record<string, unknown> = {};
  if (parsed.data.guest_name !== undefined) patch.guest_name = parsed.data.guest_name;
  if (parsed.data.max_plus_ones !== undefined) patch.max_plus_ones = parsed.data.max_plus_ones;
  if (parsed.data.guest_phone !== undefined) patch.guest_phone = parsed.data.guest_phone || null;
  if (parsed.data.email !== undefined) patch.email = parsed.data.email || null;
  if (parsed.data.group_label !== undefined) patch.group_label = parsed.data.group_label || null;
  if (parsed.data.table_id !== undefined) {
    // Assigning to a table: verify it's a table the caller can see (RLS scopes
    // non-super admins to their own events). Null clears the assignment.
    if (parsed.data.table_id !== null) {
      const { data: table } = await supabase
        .from("event_tables")
        .select("id")
        .eq("id", parsed.data.table_id)
        .single();
      if (!table) return { ok: false as const, message: "Mesa no válida" };
    }
    patch.table_id = parsed.data.table_id;
  }

  // Non-super admins use the session client, where RLS already scopes writes to
  // guests of their own events; a mismatched id simply affects 0 rows.
  const { data, error } = await supabase
    .from("event_guests")
    .update(patch)
    .eq("id", guestId)
    .select(GUEST_SELECT)
    .single();

  if (error || !data) return { ok: false as const, message: "No se pudo actualizar" };
  return { ok: true as const, guest: data as EventGuest };
}

export async function deleteGuest(
  guestId: string,
  _ownerId: string,
  superAdmin = false,
) {
  const supabase = await db(superAdmin);
  const { error } = await supabase.from("event_guests").delete().eq("id", guestId);
  if (error) return { ok: false as const, message: "No se pudo eliminar" };
  return { ok: true as const };
}
