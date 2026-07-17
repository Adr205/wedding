import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/serviceClient";
import { tableInputSchema, tablePatchSchema } from "@/lib/validation/tableSchemas";

const TABLE_SELECT = "id, name, capacity, shape, pos_x, pos_y, display_order";

export type EventTable = {
  id: string;
  name: string;
  capacity: number;
  shape: "round" | "rect";
  pos_x: number;
  pos_y: number;
  display_order: number;
};

function db(superAdmin: boolean) {
  return superAdmin ? createServiceClient() : createClient();
}

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

export async function listTables(
  eventId: string,
  ownerId: string,
  superAdmin = false,
): Promise<EventTable[]> {
  if (!(await assertOwnsEvent(eventId, ownerId, superAdmin))) return [];
  const supabase = await db(superAdmin);
  const { data } = await supabase
    .from("event_tables")
    .select(TABLE_SELECT)
    .eq("event_id", eventId)
    .order("display_order");
  return (data as EventTable[]) ?? [];
}

export async function createTable(
  eventId: string,
  ownerId: string,
  payload: unknown,
  superAdmin = false,
) {
  const parsed = tableInputSchema.safeParse(payload);
  if (!parsed.success) return { ok: false as const, message: "Datos inválidos" };
  if (!(await assertOwnsEvent(eventId, ownerId, superAdmin)))
    return { ok: false as const, message: "No autorizado" };

  const supabase = await db(superAdmin);
  // Next display_order = current count.
  const { count } = await supabase
    .from("event_tables")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId);

  const { data, error } = await supabase
    .from("event_tables")
    .insert({
      event_id: eventId,
      name: parsed.data.name,
      capacity: parsed.data.capacity,
      shape: parsed.data.shape,
      display_order: count ?? 0,
    })
    .select(TABLE_SELECT)
    .single();

  if (error || !data) return { ok: false as const, message: "No se pudo crear la mesa" };
  return { ok: true as const, table: data as EventTable };
}

export async function updateTable(
  tableId: string,
  _ownerId: string,
  payload: unknown,
  superAdmin = false,
) {
  const parsed = tablePatchSchema.safeParse(payload);
  if (!parsed.success) return { ok: false as const, message: "Datos inválidos" };

  const patch: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) patch.name = parsed.data.name;
  if (parsed.data.capacity !== undefined) patch.capacity = parsed.data.capacity;
  if (parsed.data.shape !== undefined) patch.shape = parsed.data.shape;

  const supabase = await db(superAdmin);
  const { data, error } = await supabase
    .from("event_tables")
    .update(patch)
    .eq("id", tableId)
    .select(TABLE_SELECT)
    .single();

  if (error || !data) return { ok: false as const, message: "No se pudo actualizar la mesa" };
  return { ok: true as const, table: data as EventTable };
}

export async function deleteTable(
  tableId: string,
  _ownerId: string,
  superAdmin = false,
) {
  // Guests keep existing (their table_id is set to null by the FK on delete).
  const supabase = await db(superAdmin);
  const { error } = await supabase.from("event_tables").delete().eq("id", tableId);
  if (error) return { ok: false as const, message: "No se pudo eliminar la mesa" };
  return { ok: true as const };
}
