"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { availableThemes } from "@/features/themes/registry";
import { FontSelector } from "@/features/admin/components/FontSelector";
import { BackgroundSelector } from "@/features/admin/components/BackgroundSelector";
import { PageBlocksEditor } from "@/features/admin/components/PageBlocksEditor";
import type { PageBlock } from "@/features/invitation/types/blocks";

type EventFormProps = {
  mode: "create" | "edit";
  eventId?: string;
  initialValues: Record<string, unknown>;
};

function ensureArray<T>(input: unknown): T[] {
  return Array.isArray(input) ? (input as T[]) : [];
}

export function EventForm({ mode, eventId, initialValues }: EventFormProps) {
  const router = useRouter();
  const [status, setStatus] = useState<string>("");

  const [form, setForm] = useState(() => ({
    slug: String(initialValues.slug ?? ""),
    event_type: String(initialValues.event_type ?? "wedding"),
    title: String(initialValues.title ?? ""),
    honoree_names: String(initialValues.honoree_names ?? ""),
    main_date: String(initialValues.main_date ?? new Date().toISOString()),
    timezone: String(initialValues.timezone ?? "America/Mexico_City"),
    is_published: Boolean(initialValues.is_published ?? false),
    theme_key: String(initialValues.theme_key ?? "elegant"),
    font_heading: String(initialValues.font_heading ?? "Playfair Display"),
    background_image_url: (initialValues.background_image_url as string | null) ?? null,
    default_background_key: (initialValues.default_background_key as string | null) ?? null,
    text_color: (initialValues.text_color as string | null) ?? null,
    card_bg: (initialValues.card_bg as string | null) ?? null,
    whatsapp_number: String(initialValues.whatsapp_number ?? "52"),
    message_template: String(
      initialValues.message_template ?? "Hola, confirmo mi asistencia a {{eventTitle}}.",
    ),
    blocks: ensureArray<PageBlock>(initialValues.blocks),
  }));

  const endpoint = useMemo(() => {
    if (mode === "create") return "/api/admin/events";
    return `/api/admin/events/${eventId}`;
  }, [mode, eventId]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Guardando...");

    try {
      const payload = {
        slug: form.slug,
        event_type: form.event_type,
        title: form.title,
        honoree_names: form.honoree_names,
        main_date: new Date(form.main_date).toISOString(),
        timezone: form.timezone,
        is_published: form.is_published,
        theme_key: form.theme_key,
        font_heading: form.font_heading,
        background_image_url: form.background_image_url || null,
        default_background_key: form.default_background_key || null,
        text_color: form.text_color || null,
        card_bg: form.card_bg || null,
        whatsapp_number: form.whatsapp_number,
        message_template: form.message_template,
        blocks: form.blocks.map((block, i) => ({ ...block, display_order: i })),
      };

      const res = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        const msg = data.message ?? "Error al guardar";
        setStatus(msg);
        toast.error(msg);
        return;
      }

      toast.success(
        mode === "create" ? "Invitación creada correctamente" : "Cambios guardados correctamente",
      );
      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      const msg =
        error instanceof Error ? error.message : "No se pudo guardar. Verifica los datos.";
      setStatus(msg);
      toast.error(msg);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
    >
      {/* ── Datos del evento ───────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Slug
          <input
            className="rounded-lg border border-zinc-300 p-2"
            value={form.slug}
            onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tipo de evento
          <select
            className="rounded-lg border border-zinc-300 p-2"
            value={form.event_type}
            onChange={(e) => setForm((prev) => ({ ...prev, event_type: e.target.value }))}
          >
            <option value="wedding">Boda</option>
            <option value="xv">XV Años</option>
            <option value="other">Otro</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Título del evento
          <input
            className="rounded-lg border border-zinc-300 p-2"
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Novios / Festejada
          <input
            className="rounded-lg border border-zinc-300 p-2"
            value={form.honoree_names}
            onChange={(e) => setForm((prev) => ({ ...prev, honoree_names: e.target.value }))}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Fecha principal
          <input
            type="datetime-local"
            className="rounded-lg border border-zinc-300 p-2"
            value={new Date(form.main_date).toISOString().slice(0, 16)}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, main_date: new Date(e.target.value).toISOString() }))
            }
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tema visual
          <select
            className="rounded-lg border border-zinc-300 p-2"
            value={form.theme_key}
            onChange={(e) => setForm((prev) => ({ ...prev, theme_key: e.target.value }))}
          >
            {availableThemes.map((theme) => (
              <option key={theme.key} value={theme.key}>
                {theme.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <FontSelector
        value={form.font_heading}
        onChange={(key) => setForm((prev) => ({ ...prev, font_heading: key }))}
      />

      <BackgroundSelector
        backgroundImageUrl={form.background_image_url}
        defaultBackgroundKey={form.default_background_key}
        onChangePreset={(key) => setForm((prev) => ({ ...prev, default_background_key: key }))}
        onChangeCustomUrl={(url) => setForm((prev) => ({ ...prev, background_image_url: url || null }))}
      />

      {/* ── Colores ────────────────────────────────────── */}
      <div className="space-y-2 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <h3 className="font-semibold text-sm">Colores de la invitación</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Sobreescribe el color del texto y de las cards. Útil cuando el fondo dificulta la lectura.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm flex items-center gap-2">
              Color del texto
              <input
                type="color"
                value={form.text_color ?? "#ffffff"}
                onChange={(e) => setForm((prev) => ({ ...prev, text_color: e.target.value }))}
                className="w-8 h-8 rounded cursor-pointer border border-zinc-300"
              />
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                placeholder="#ffffff o rgba(…)"
                value={form.text_color ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, text_color: e.target.value || null }))}
              />
              {form.text_color ? (
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, text_color: null }))}
                  className="rounded-lg border border-zinc-300 px-2 text-xs hover:bg-zinc-100 dark:border-zinc-600"
                >
                  Quitar
                </button>
              ) : null}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm flex items-center gap-2">
              Fondo de cards
              <input
                type="color"
                value={form.card_bg ?? "#ffffff"}
                onChange={(e) => setForm((prev) => ({ ...prev, card_bg: e.target.value }))}
                className="w-8 h-8 rounded cursor-pointer border border-zinc-300"
              />
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
                placeholder="rgba(255,255,255,0.4)"
                value={form.card_bg ?? ""}
                onChange={(e) => setForm((prev) => ({ ...prev, card_bg: e.target.value || null }))}
              />
              {form.card_bg ? (
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, card_bg: null }))}
                  className="rounded-lg border border-zinc-300 px-2 text-xs hover:bg-zinc-100 dark:border-zinc-600"
                >
                  Quitar
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ── RSVP config ────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Número WhatsApp (RSVP)
          <input
            className="rounded-lg border border-zinc-300 p-2"
            value={form.whatsapp_number}
            onChange={(e) => setForm((prev) => ({ ...prev, whatsapp_number: e.target.value }))}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Publicado
          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className="text-sm text-zinc-500">Visible para invitados</span>
          </div>
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Plantilla de mensaje WhatsApp
        <textarea
          className="min-h-20 rounded-lg border border-zinc-300 p-2"
          value={form.message_template}
          onChange={(e) => setForm((prev) => ({ ...prev, message_template: e.target.value }))}
        />
      </label>

      {/* ── Bloques de la página ─────────────────────────── */}
      <PageBlocksEditor
        blocks={form.blocks}
        onChange={(blocks) => setForm((prev) => ({ ...prev, blocks }))}
      />

      {/* ── Actions ────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin/events")}
          className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300"
        >
          ← Cancelar
        </button>
        <div className="flex items-center gap-3">
          {status && !status.startsWith("Guard") ? (
            <p className="text-sm text-rose-600">{status}</p>
          ) : null}
          <button
            type="submit"
            className="rounded-xl bg-zinc-900 px-6 py-3 font-semibold text-white hover:bg-zinc-700 transition-colors"
          >
            {mode === "create" ? "Crear invitación" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </form>
  );
}
