"use client";

import { useMemo, useState } from "react";
import { availableThemes } from "@/features/themes/registry";
import { GalleryManager, type GalleryItem } from "@/features/admin/components/GalleryManager";
import { FontSelector } from "@/features/admin/components/FontSelector";
import { BackgroundSelector } from "@/features/admin/components/BackgroundSelector";

type EventFormProps = {
  mode: "create" | "edit";
  eventId?: string;
  initialValues: Record<string, unknown>;
};

type SectionItem = {
  section_key: string;
  heading: string;
  body: string;
  display_order: number;
};

type ScheduleItem = {
  title: string;
  starts_at: string;
  ends_at?: string | null;
  details?: string | null;
  display_order: number;
};

type LocationItem = {
  label: string;
  address: string;
  maps_url?: string | null;
  starts_at?: string | null;
  display_order: number;
};

function ensureArray<T>(input: unknown): T[] {
  return Array.isArray(input) ? (input as T[]) : [];
}

function toDateTimeLocalValue(isoDate: string) {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 16);
}

function toIsoOrNull(localValue: string) {
  if (!localValue) return null;
  return new Date(localValue).toISOString();
}

export function EventForm({ mode, eventId, initialValues }: EventFormProps) {
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
    whatsapp_number: String(initialValues.whatsapp_number ?? "52"),
    message_template: String(initialValues.message_template ?? "Hola, confirmo mi asistencia a {{eventTitle}}."),
    sections: ensureArray<SectionItem>(initialValues.sections),
    gallery: ensureArray<GalleryItem>(initialValues.gallery),
    schedule: ensureArray<ScheduleItem>(initialValues.schedule),
    locations: ensureArray<LocationItem>(initialValues.locations),
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
        whatsapp_number: form.whatsapp_number,
        message_template: form.message_template,
        sections: form.sections.map((item, index) => ({
          ...item,
          display_order: index,
        })),
        gallery: form.gallery.map((item, index) => ({
          ...item,
          display_order: index,
        })),
        schedule: form.schedule.map((item, index) => ({
          ...item,
          starts_at: new Date(item.starts_at).toISOString(),
          ends_at: item.ends_at ? new Date(item.ends_at).toISOString() : null,
          display_order: index,
        })),
        locations: form.locations.map((item, index) => ({
          ...item,
          starts_at: item.starts_at ? new Date(item.starts_at).toISOString() : null,
          display_order: index,
        })),
      };

      const res = await fetch(endpoint, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setStatus(data.message ?? "Error al guardar.");
        return;
      }

      const data = (await res.json()) as { eventId: string };
      setStatus(`Guardado correctamente. ID: ${data.eventId}`);
    } catch (error) {
      if (error instanceof Error) {
        setStatus(error.message);
        return;
      }
      setStatus("No se pudo guardar. Verifica los datos del formulario.");
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Slug
          <input className="rounded-lg border border-zinc-300 p-2" value={form.slug} onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))} required />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tipo de evento
          <select className="rounded-lg border border-zinc-300 p-2" value={form.event_type} onChange={(e) => setForm((prev) => ({ ...prev, event_type: e.target.value }))}>
            <option value="wedding">Boda</option>
            <option value="xv">XV Años</option>
            <option value="other">Otro</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Título del evento
          <input className="rounded-lg border border-zinc-300 p-2" value={form.title} onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))} required />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Novios / Festejada
          <input className="rounded-lg border border-zinc-300 p-2" value={form.honoree_names} onChange={(e) => setForm((prev) => ({ ...prev, honoree_names: e.target.value }))} required />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Fecha principal
          <input
            type="datetime-local"
            className="rounded-lg border border-zinc-300 p-2"
            value={new Date(form.main_date).toISOString().slice(0, 16)}
            onChange={(e) => setForm((prev) => ({ ...prev, main_date: new Date(e.target.value).toISOString() }))}
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Tema visual
          <select className="rounded-lg border border-zinc-300 p-2" value={form.theme_key} onChange={(e) => setForm((prev) => ({ ...prev, theme_key: e.target.value }))}>
            {availableThemes.map((theme) => (
              <option key={theme.key} value={theme.key}>
                {theme.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <FontSelector value={form.font_heading} onChange={(key) => setForm((prev) => ({ ...prev, font_heading: key }))} />

      <BackgroundSelector
        backgroundImageUrl={form.background_image_url}
        defaultBackgroundKey={form.default_background_key}
        onChangePreset={(key) => setForm((prev) => ({ ...prev, default_background_key: key }))}
        onChangeCustomUrl={(url) => setForm((prev) => ({ ...prev, background_image_url: url || null }))}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Número WhatsApp destino
          <input className="rounded-lg border border-zinc-300 p-2" value={form.whatsapp_number} onChange={(e) => setForm((prev) => ({ ...prev, whatsapp_number: e.target.value }))} />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Publicado
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm((prev) => ({ ...prev, is_published: e.target.checked }))} />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-sm">
        Plantilla de mensaje WhatsApp
        <textarea className="min-h-20 rounded-lg border border-zinc-300 p-2" value={form.message_template} onChange={(e) => setForm((prev) => ({ ...prev, message_template: e.target.value }))} />
      </label>

      <section className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Secciones de contenido</h3>
          <button
            type="button"
            className="rounded-lg border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                sections: [
                  ...prev.sections,
                  {
                    section_key: `seccion-${prev.sections.length + 1}`,
                    heading: "",
                    body: "",
                    display_order: prev.sections.length,
                  },
                ],
              }))
            }
          >
            Agregar sección
          </button>
        </div>
        {form.sections.length === 0 ? <p className="text-sm text-zinc-500 dark:text-zinc-400">No hay secciones aún.</p> : null}
        {form.sections.map((section, index) => (
          <div
            key={`${section.section_key}-${index}`}
            className="grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 md:grid-cols-3 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <input
              className="rounded-md border border-zinc-300 p-2 text-sm"
              placeholder="Clave (ej. bienvenida)"
              value={section.section_key}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  sections: prev.sections.map((item, idx) => (idx === index ? { ...item, section_key: e.target.value } : item)),
                }))
              }
            />
            <input
              className="rounded-md border border-zinc-300 p-2 text-sm"
              placeholder="Título"
              value={section.heading}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  sections: prev.sections.map((item, idx) => (idx === index ? { ...item, heading: e.target.value } : item)),
                }))
              }
            />
            <button
              type="button"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  sections: prev.sections.filter((_, idx) => idx !== index),
                }))
              }
            >
              Quitar
            </button>
            <textarea
              className="rounded-md border border-zinc-300 p-2 text-sm md:col-span-3"
              placeholder="Texto de la sección"
              value={section.body}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  sections: prev.sections.map((item, idx) => (idx === index ? { ...item, body: e.target.value } : item)),
                }))
              }
            />
          </div>
        ))}
      </section>

      <GalleryManager items={form.gallery} onChange={(gallery) => setForm((prev) => ({ ...prev, gallery }))} />

      <section className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Agenda</h3>
          <button
            type="button"
            className="rounded-lg border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                schedule: [
                  ...prev.schedule,
                  {
                    title: "",
                    starts_at: new Date().toISOString(),
                    ends_at: null,
                    details: "",
                    display_order: prev.schedule.length,
                  },
                ],
              }))
            }
          >
            Agregar momento
          </button>
        </div>
        {form.schedule.length === 0 ? <p className="text-sm text-zinc-500 dark:text-zinc-400">No hay momentos cargados.</p> : null}
        {form.schedule.map((item, index) => (
          <div
            key={`${item.title}-${index}`}
            className="grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 md:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <input
              className="rounded-md border border-zinc-300 p-2 text-sm"
              placeholder="Título (ej. Ceremonia)"
              value={item.title}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  schedule: prev.schedule.map((s, idx) => (idx === index ? { ...s, title: e.target.value } : s)),
                }))
              }
            />
            <button
              type="button"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  schedule: prev.schedule.filter((_, idx) => idx !== index),
                }))
              }
            >
              Quitar
            </button>
            <input
              type="datetime-local"
              className="rounded-md border border-zinc-300 p-2 text-sm"
              value={toDateTimeLocalValue(item.starts_at)}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  schedule: prev.schedule.map((s, idx) => (idx === index ? { ...s, starts_at: toIsoOrNull(e.target.value) ?? s.starts_at } : s)),
                }))
              }
            />
            <input
              type="datetime-local"
              className="rounded-md border border-zinc-300 p-2 text-sm"
              value={toDateTimeLocalValue(item.ends_at ?? "")}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  schedule: prev.schedule.map((s, idx) => (idx === index ? { ...s, ends_at: toIsoOrNull(e.target.value) } : s)),
                }))
              }
            />
            <textarea
              className="rounded-md border border-zinc-300 p-2 text-sm md:col-span-2"
              placeholder="Detalles opcionales"
              value={item.details ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  schedule: prev.schedule.map((s, idx) => (idx === index ? { ...s, details: e.target.value } : s)),
                }))
              }
            />
          </div>
        ))}
      </section>

      <section className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Ubicaciones</h3>
          <button
            type="button"
            className="rounded-lg border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100"
            onClick={() =>
              setForm((prev) => ({
                ...prev,
                locations: [
                  ...prev.locations,
                  {
                    label: "",
                    address: "",
                    maps_url: "",
                    starts_at: null,
                    display_order: prev.locations.length,
                  },
                ],
              }))
            }
          >
            Agregar ubicación
          </button>
        </div>
        {form.locations.length === 0 ? <p className="text-sm text-zinc-500 dark:text-zinc-400">No hay ubicaciones cargadas.</p> : null}
        {form.locations.map((location, index) => (
          <div
            key={`${location.label}-${index}`}
            className="grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 md:grid-cols-2 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <input
              className="rounded-md border border-zinc-300 p-2 text-sm"
              placeholder="Etiqueta (ej. Recepción)"
              value={location.label}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  locations: prev.locations.map((item, idx) => (idx === index ? { ...item, label: e.target.value } : item)),
                }))
              }
            />
            <button
              type="button"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  locations: prev.locations.filter((_, idx) => idx !== index),
                }))
              }
            >
              Quitar
            </button>
            <input
              className="rounded-md border border-zinc-300 p-2 text-sm md:col-span-2"
              placeholder="Dirección"
              value={location.address}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  locations: prev.locations.map((item, idx) => (idx === index ? { ...item, address: e.target.value } : item)),
                }))
              }
            />
            <input
              className="rounded-md border border-zinc-300 p-2 text-sm md:col-span-2"
              placeholder="URL de Google Maps"
              value={location.maps_url ?? ""}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  locations: prev.locations.map((item, idx) => (idx === index ? { ...item, maps_url: e.target.value } : item)),
                }))
              }
            />
          </div>
        ))}
      </section>

      <button type="submit" className="rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white hover:bg-zinc-700">
        {mode === "create" ? "Crear sitio de invitación" : "Guardar cambios"}
      </button>

      {status ? <p className="text-sm text-zinc-600 dark:text-zinc-300">{status}</p> : null}
    </form>
  );
}
