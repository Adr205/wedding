"use client";

import { useMemo, useState } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";
import type { EventGuest } from "@/features/admin/data/guests";
import type { EventTable } from "@/features/admin/data/tables";

type Props = {
  eventId: string;
  initialTables: EventTable[];
  initialGuests: EventGuest[];
};

const POOL_ID = "pool";

function seatsOf(g: EventGuest) {
  return 1 + (g.plus_ones ?? 0);
}

const STATUS_DOT: Record<EventGuest["confirmation_status"], string> = {
  confirmed: "bg-emerald-500",
  declined: "bg-rose-400",
  pending: "bg-zinc-300 dark:bg-zinc-600",
};

// ── Draggable guest chip ────────────────────────────────────────────────────
function GuestChip({ guest, onUnassign }: { guest: EventGuest; onUnassign?: () => void }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: guest.id,
    data: { guest },
  });

  return (
    <div
      ref={setNodeRef}
      className={`group flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-2.5 py-1.5 text-sm shadow-sm dark:border-zinc-700 dark:bg-zinc-800 ${
        isDragging ? "opacity-30" : ""
      }`}
    >
      <button
        type="button"
        className="cursor-grab touch-none active:cursor-grabbing"
        {...listeners}
        {...attributes}
        aria-label={`Mover ${guest.guest_name}`}
      >
        <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[guest.confirmation_status]}`} />
      </button>
      <span className="flex-1 truncate" {...listeners} {...attributes}>
        {guest.guest_name}
        {seatsOf(guest) > 1 ? <span className="ml-1 text-xs text-zinc-400">+{guest.plus_ones}</span> : null}
      </span>
      {onUnassign ? (
        <button
          type="button"
          onClick={onUnassign}
          className="opacity-0 group-hover:opacity-100 text-xs text-zinc-400 hover:text-rose-500 transition-opacity"
          title="Quitar de la mesa"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
}

// ── Droppable container ─────────────────────────────────────────────────────
function Droppable({
  id,
  children,
  className,
}: {
  id: string;
  children: React.ReactNode;
  className?: string;
}) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`${className ?? ""} ${isOver ? "ring-2 ring-emerald-400" : ""}`}>
      {children}
    </div>
  );
}

export function SeatingManager({ eventId, initialTables, initialGuests }: Props) {
  const [tables, setTables] = useState<EventTable[]>(initialTables);
  const [guests, setGuests] = useState<EventGuest[]>(initialGuests);
  const [activeGuest, setActiveGuest] = useState<EventGuest | null>(null);

  // New table form
  const [tableName, setTableName] = useState("");
  const [tableCap, setTableCap] = useState(8);

  // Quick add guest
  const [quickName, setQuickName] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor),
  );

  const unassigned = useMemo(() => guests.filter((g) => !g.table_id), [guests]);
  const byTable = useMemo(() => {
    const map = new Map<string, EventGuest[]>();
    for (const t of tables) map.set(t.id, []);
    for (const g of guests) {
      if (g.table_id && map.has(g.table_id)) map.get(g.table_id)!.push(g);
    }
    return map;
  }, [guests, tables]);

  const totalSeated = guests.filter((g) => g.table_id).length;

  // ── Assignment ────────────────────────────────────────────────────────────
  async function assign(guestId: string, tableId: string | null) {
    const prev = guests;
    setGuests((gs) => gs.map((g) => (g.id === guestId ? { ...g, table_id: tableId } : g)));
    try {
      const res = await fetch(`/api/admin/events/${eventId}/guests/${guestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table_id: tableId }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setGuests(prev);
      toast.error("No se pudo mover el invitado");
    }
  }

  function onDragStart(e: DragStartEvent) {
    setActiveGuest((e.active.data.current?.guest as EventGuest) ?? null);
  }

  function onDragEnd(e: DragEndEvent) {
    setActiveGuest(null);
    const { active, over } = e;
    if (!over) return;
    const guestId = String(active.id);
    const target = over.id === POOL_ID ? null : String(over.id);
    const guest = guests.find((g) => g.id === guestId);
    if (!guest || guest.table_id === target) return;
    assign(guestId, target);
  }

  // ── Table CRUD ────────────────────────────────────────────────────────────
  async function addTable(e: React.FormEvent) {
    e.preventDefault();
    const name = tableName.trim() || `Mesa ${tables.length + 1}`;
    try {
      const res = await fetch(`/api/admin/events/${eventId}/tables`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, capacity: tableCap }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTables((t) => [...t, data.table as EventTable]);
      setTableName("");
      toast.success("Mesa creada");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo crear la mesa");
    }
  }

  async function removeTable(table: EventTable) {
    if (!confirm(`¿Eliminar "${table.name}"? Los invitados volverán a "Sin asignar".`)) return;
    const prevTables = tables;
    const prevGuests = guests;
    setTables((t) => t.filter((x) => x.id !== table.id));
    setGuests((gs) => gs.map((g) => (g.table_id === table.id ? { ...g, table_id: null } : g)));
    try {
      const res = await fetch(`/api/admin/events/${eventId}/tables/${table.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setTables(prevTables);
      setGuests(prevGuests);
      toast.error("No se pudo eliminar la mesa");
    }
  }

  async function renameTable(table: EventTable) {
    const name = prompt("Nombre de la mesa", table.name)?.trim();
    if (!name || name === table.name) return;
    setTables((t) => t.map((x) => (x.id === table.id ? { ...x, name } : x)));
    try {
      const res = await fetch(`/api/admin/events/${eventId}/tables/${table.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
    } catch {
      toast.error("No se pudo renombrar");
    }
  }

  // ── Quick add guest (people who confirmed off-platform) ────────────────────
  async function quickAdd(e: React.FormEvent) {
    e.preventDefault();
    const name = quickName.trim();
    if (name.length < 2) return;
    try {
      const res = await fetch(`/api/admin/events/${eventId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_name: name, max_plus_ones: 0 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setGuests((gs) => [data.guest as EventGuest, ...gs]);
      setQuickName("");
      toast.success("Invitado agregado a “Sin asignar”");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo agregar");
    }
  }

  return (
    <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
        {/* ── Unassigned pool ──────────────────────────────── */}
        <Droppable
          id={POOL_ID}
          className="h-fit rounded-2xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-700 dark:bg-zinc-900/50"
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold">Sin asignar</h2>
            <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
              {unassigned.length}
            </span>
          </div>

          <form onSubmit={quickAdd} className="mb-3 flex gap-1.5">
            <input
              value={quickName}
              onChange={(e) => setQuickName(e.target.value)}
              placeholder="Agregar invitado…"
              className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-2.5 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
            <button
              type="submit"
              className="rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-white dark:text-zinc-900"
            >
              +
            </button>
          </form>

          <div className="space-y-2">
            {unassigned.length === 0 ? (
              <p className="py-6 text-center text-xs text-zinc-400">Todos asignados 🎉</p>
            ) : (
              unassigned.map((g) => <GuestChip key={g.id} guest={g} />)
            )}
          </div>
        </Droppable>

        {/* ── Tables ───────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {tables.length} mesas · {totalSeated}/{guests.length} invitados asignados
            </p>
            <form onSubmit={addTable} className="flex items-end gap-2">
              <input
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                placeholder={`Mesa ${tables.length + 1}`}
                className="w-32 rounded-lg border border-zinc-300 px-2.5 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
              />
              <input
                type="number"
                min={1}
                max={60}
                value={tableCap}
                onChange={(e) => setTableCap(Number(e.target.value))}
                className="w-16 rounded-lg border border-zinc-300 px-2.5 py-1.5 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                title="Capacidad"
              />
              <button
                type="submit"
                className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-300"
              >
                + Mesa
              </button>
            </form>
          </div>

          {tables.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 py-16 text-center text-sm text-zinc-400 dark:border-zinc-600">
              Crea tu primera mesa para empezar a asignar invitados.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {tables.map((table) => {
                const seated = byTable.get(table.id) ?? [];
                const occupied = seated.reduce((s, g) => s + seatsOf(g), 0);
                const over = occupied > table.capacity;
                return (
                  <Droppable
                    key={table.id}
                    id={table.id}
                    className={`rounded-2xl border bg-white p-4 shadow-sm dark:bg-zinc-900 ${
                      over ? "border-rose-400" : "border-zinc-200 dark:border-zinc-700"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => renameTable(table)}
                        className="truncate text-left font-semibold hover:underline"
                        title="Renombrar"
                      >
                        {table.name}
                      </button>
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            over
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300"
                              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                          }`}
                        >
                          {occupied}/{table.capacity}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTable(table)}
                          className="text-xs text-zinc-400 hover:text-rose-500"
                          title="Eliminar mesa"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div className="min-h-[60px] space-y-2">
                      {seated.length === 0 ? (
                        <p className="py-4 text-center text-xs text-zinc-400">Arrastra invitados aquí</p>
                      ) : (
                        seated.map((g) => (
                          <GuestChip key={g.id} guest={g} onUnassign={() => assign(g.id, null)} />
                        ))
                      )}
                    </div>
                  </Droppable>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeGuest ? (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-300 bg-white px-2.5 py-1.5 text-sm shadow-lg dark:bg-zinc-800">
            <span className={`inline-block h-2 w-2 rounded-full ${STATUS_DOT[activeGuest.confirmation_status]}`} />
            {activeGuest.guest_name}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
