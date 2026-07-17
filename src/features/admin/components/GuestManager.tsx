"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { EventGuest } from "@/features/admin/data/guests";

type Props = {
  eventId: string;
  slug: string;
  eventTitle: string;
  isPublished: boolean;
  initialGuests: EventGuest[];
};

type GuestStatus = "pending" | "viewed" | "confirmed" | "declined";

function statusOf(g: EventGuest): GuestStatus {
  if (g.confirmation_status === "confirmed") return "confirmed";
  if (g.confirmation_status === "declined") return "declined";
  return g.viewed_at ? "viewed" : "pending";
}

const STATUS_META: Record<GuestStatus, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300" },
  viewed: { label: "Vio la invitación", className: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300" },
  confirmed: { label: "Confirmado", className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300" },
  declined: { label: "No asistirá", className: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300" },
};

export function GuestManager({ eventId, slug, eventTitle, isPublished, initialGuests }: Props) {
  const [guests, setGuests] = useState<EventGuest[]>(initialGuests);
  const [busy, setBusy] = useState(false);

  // Single add form
  const [name, setName] = useState("");
  const [maxPlus, setMaxPlus] = useState(0);
  const [group, setGroup] = useState("");

  // Bulk add
  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkText, setBulkText] = useState("");
  const [bulkMax, setBulkMax] = useState(0);
  const [bulkGroup, setBulkGroup] = useState("");

  const stats = useMemo(() => {
    const confirmed = guests.filter((g) => g.confirmation_status === "confirmed");
    const declined = guests.filter((g) => g.confirmation_status === "declined");
    const viewed = guests.filter((g) => statusOf(g) === "viewed");
    const attendees = confirmed.reduce((s, g) => s + 1 + (g.plus_ones ?? 0), 0);
    return {
      total: guests.length,
      confirmed: confirmed.length,
      declined: declined.length,
      viewed: viewed.length,
      attendees,
    };
  }, [guests]);

  function inviteLink(g: EventGuest) {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/i/${slug}?g=${g.invite_token}`;
  }

  async function copyLink(g: EventGuest) {
    try {
      await navigator.clipboard.writeText(inviteLink(g));
      toast.success("Link copiado");
    } catch {
      toast.error("No se pudo copiar");
    }
  }

  function whatsappHref(g: EventGuest) {
    const msg = `Hola ${g.guest_name} 💍 Te invitamos a ${eventTitle}. Confirma tu asistencia aquí: ${inviteLink(g)}`;
    const phone = (g.guest_phone ?? "").replace(/[^\d]/g, "");
    return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
  }

  async function addSingle(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guest_name: name.trim(), max_plus_ones: maxPlus, group_label: group.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setGuests((prev) => [data.guest as EventGuest, ...prev]);
      setName("");
      setGroup("");
      toast.success("Invitado agregado");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo agregar");
    } finally {
      setBusy(false);
    }
  }

  async function addBulk() {
    const names = bulkText
      .split("\n")
      .map((n) => n.trim())
      .filter((n) => n.length >= 2);
    if (names.length === 0) {
      toast.error("Escribe al menos un nombre");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/guests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ names, max_plus_ones: bulkMax, group_label: bulkGroup.trim() || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setGuests((prev) => [...(data.guests as EventGuest[]), ...prev]);
      setBulkText("");
      setBulkGroup("");
      setBulkOpen(false);
      toast.success(`${(data.guests as EventGuest[]).length} invitados agregados`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudieron agregar");
    } finally {
      setBusy(false);
    }
  }

  async function removeGuest(g: EventGuest) {
    if (!confirm(`¿Eliminar a ${g.guest_name}?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/events/${eventId}/guests/${g.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setGuests((prev) => prev.filter((x) => x.id !== g.id));
      toast.success("Invitado eliminado");
    } catch {
      toast.error("No se pudo eliminar");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold">Lista de invitados</h2>
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="rounded-full bg-zinc-100 px-3 py-1 font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {stats.total} invitados
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
            {stats.confirmed} confirmados · {stats.attendees} asistentes
          </span>
          {stats.declined > 0 ? (
            <span className="rounded-full bg-rose-100 px-3 py-1 font-medium text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
              {stats.declined} no asistirán
            </span>
          ) : null}
          {guests.length > 0 ? (
            <a
              href={`/api/admin/events/${eventId}/rsvp-csv`}
              download
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1 font-medium text-zinc-600 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-400"
            >
              Exportar CSV
            </a>
          ) : null}
        </div>
      </div>

      {/* Add forms */}
      <div className="mb-5 space-y-3">
        <form onSubmit={addSingle} className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label className="text-xs text-zinc-400">Nombre</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre del invitado"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div className="flex flex-col gap-1 w-24">
            <label className="text-xs text-zinc-400">Cupos</label>
            <input
              type="number"
              min={0}
              max={20}
              value={maxPlus}
              onChange={(e) => setMaxPlus(Number(e.target.value))}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <div className="flex flex-col gap-1 w-40">
            <label className="text-xs text-zinc-400">Grupo (opcional)</label>
            <input
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              placeholder="Familia novia…"
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors disabled:opacity-50 dark:bg-white dark:text-zinc-900"
          >
            Agregar
          </button>
          <button
            type="button"
            onClick={() => setBulkOpen((v) => !v)}
            className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300"
          >
            Alta masiva
          </button>
        </form>

        {bulkOpen ? (
          <div className="rounded-xl border border-dashed border-zinc-300 p-3 dark:border-zinc-600">
            <p className="text-xs text-zinc-400 mb-2">Un nombre por línea</p>
            <textarea
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={5}
              placeholder={"Ana López\nJuan Pérez\nFamilia García"}
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
            />
            <div className="flex flex-wrap items-end gap-2 mt-2">
              <div className="flex flex-col gap-1 w-24">
                <label className="text-xs text-zinc-400">Cupos c/u</label>
                <input
                  type="number"
                  min={0}
                  max={20}
                  value={bulkMax}
                  onChange={(e) => setBulkMax(Number(e.target.value))}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                />
              </div>
              <div className="flex flex-col gap-1 w-40">
                <label className="text-xs text-zinc-400">Grupo (opcional)</label>
                <input
                  value={bulkGroup}
                  onChange={(e) => setBulkGroup(e.target.value)}
                  className="rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                />
              </div>
              <button
                type="button"
                onClick={addBulk}
                disabled={busy}
                className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 transition-colors disabled:opacity-50 dark:bg-white dark:text-zinc-900"
              >
                Agregar todos
              </button>
            </div>
          </div>
        ) : null}
      </div>

      {!isPublished ? (
        <p className="mb-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
          El evento no está publicado: los links personalizados funcionarán cuando lo publiques.
        </p>
      ) : null}

      {guests.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Aún no hay invitados. Agrega el primero arriba.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 text-left text-xs uppercase tracking-wider text-zinc-400">
                <th className="pb-2 pr-4">Nombre</th>
                <th className="pb-2 pr-4">Grupo</th>
                <th className="pb-2 pr-4 text-center">Cupos</th>
                <th className="pb-2 pr-4 text-center">Estado</th>
                <th className="pb-2 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {guests.map((g) => {
                const meta = STATUS_META[statusOf(g)];
                return (
                  <tr key={g.id}>
                    <td className="py-2 pr-4 font-medium">
                      {g.guest_name}
                      {g.confirmation_status === "confirmed" && g.plus_ones > 0 ? (
                        <span className="ml-1 text-xs text-zinc-400">+{g.plus_ones}</span>
                      ) : null}
                    </td>
                    <td className="py-2 pr-4 text-zinc-500">{g.group_label ?? "—"}</td>
                    <td className="py-2 pr-4 text-center text-zinc-500">{g.max_plus_ones}</td>
                    <td className="py-2 pr-4 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.className}`}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="py-2 text-right whitespace-nowrap">
                      <button
                        onClick={() => copyLink(g)}
                        className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition-colors dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                        title="Copiar link personalizado"
                      >
                        Copiar link
                      </button>
                      <a
                        href={whatsappHref(g)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md px-2 py-1 text-xs text-emerald-600 hover:bg-emerald-50 transition-colors dark:hover:bg-emerald-900/30"
                        title="Enviar por WhatsApp"
                      >
                        WhatsApp
                      </a>
                      <button
                        onClick={() => removeGuest(g)}
                        className="rounded-md px-2 py-1 text-xs text-rose-500 hover:bg-rose-50 transition-colors dark:hover:bg-rose-900/30"
                        title="Eliminar"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
