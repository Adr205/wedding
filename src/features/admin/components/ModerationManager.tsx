"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { ModMessage, ModUpload } from "@/features/admin/data/community";

type Props = {
  eventId: string;
  initialMessages: ModMessage[];
  initialUploads: ModUpload[];
};

export function ModerationManager({ eventId, initialMessages, initialUploads }: Props) {
  const [messages, setMessages] = useState<ModMessage[]>(initialMessages);
  const [uploads, setUploads] = useState<ModUpload[]>(initialUploads);

  const pendingMsgs = messages.filter((m) => !m.approved).length;
  const pendingUploads = uploads.filter((u) => !u.approved).length;

  // ── Messages ──────────────────────────────────────────────────────────────
  async function toggleMessage(m: ModMessage) {
    const next = !m.approved;
    setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, approved: next } : x)));
    try {
      const res = await fetch(`/api/admin/events/${eventId}/messages/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, approved: !next } : x)));
      toast.error("No se pudo actualizar");
    }
  }

  async function removeMessage(m: ModMessage) {
    if (!confirm("¿Eliminar este mensaje?")) return;
    const prev = messages;
    setMessages((list) => list.filter((x) => x.id !== m.id));
    try {
      const res = await fetch(`/api/admin/events/${eventId}/messages/${m.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setMessages(prev);
      toast.error("No se pudo eliminar");
    }
  }

  // ── Uploads ───────────────────────────────────────────────────────────────
  async function toggleUpload(u: ModUpload) {
    const next = !u.approved;
    setUploads((list) => list.map((x) => (x.id === u.id ? { ...x, approved: next } : x)));
    try {
      const res = await fetch(`/api/admin/events/${eventId}/uploads/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setUploads((list) => list.map((x) => (x.id === u.id ? { ...x, approved: !next } : x)));
      toast.error("No se pudo actualizar");
    }
  }

  async function removeUpload(u: ModUpload) {
    if (!confirm("¿Eliminar esta foto? Se borrará del almacenamiento.")) return;
    const prev = uploads;
    setUploads((list) => list.filter((x) => x.id !== u.id));
    try {
      const res = await fetch(`/api/admin/events/${eventId}/uploads/${u.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setUploads(prev);
      toast.error("No se pudo eliminar");
    }
  }

  return (
    <div className="space-y-8">
      {/* ── Messages ──────────────────────────────────── */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Libro de mensajes</h2>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            {pendingMsgs} por revisar · {messages.length} total
          </span>
        </div>
        {messages.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Aún no hay mensajes.</p>
        ) : (
          <ul className="space-y-2">
            {messages.map((m) => (
              <li
                key={m.id}
                className="flex items-start gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
              >
                <div className="flex-1">
                  <p className="text-sm leading-relaxed">{m.body}</p>
                  <p className="mt-1 text-xs text-zinc-400">— {m.author_name}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    onClick={() => toggleMessage(m)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
                      m.approved
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                        : "bg-zinc-100 text-zinc-600 hover:bg-emerald-50 dark:bg-zinc-800 dark:text-zinc-300"
                    }`}
                  >
                    {m.approved ? "Aprobado ✓" : "Aprobar"}
                  </button>
                  <button
                    onClick={() => removeMessage(m)}
                    className="rounded-lg px-2 py-1 text-xs text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Uploads ───────────────────────────────────── */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Fotos de invitados</h2>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
            {pendingUploads} por revisar · {uploads.length} total
          </span>
        </div>
        {uploads.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Aún no hay fotos subidas.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {uploads.map((u) => (
              <figure key={u.id} className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.image_url} alt={u.uploader_name ?? "Foto"} className="aspect-square w-full object-cover" />
                {!u.approved ? (
                  <span className="absolute left-1.5 top-1.5 rounded-full bg-amber-500/90 px-2 py-0.5 text-[10px] font-medium text-white">
                    Pendiente
                  </span>
                ) : null}
                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/55 p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => toggleUpload(u)}
                    className="rounded px-2 py-0.5 text-xs font-medium text-white hover:bg-white/20"
                  >
                    {u.approved ? "Ocultar" : "Aprobar"}
                  </button>
                  <button
                    onClick={() => removeUpload(u)}
                    className="rounded px-2 py-0.5 text-xs text-rose-300 hover:bg-white/20"
                  >
                    Eliminar
                  </button>
                </div>
              </figure>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
