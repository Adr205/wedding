"use client";

import { useState } from "react";
import {
  type PageBlock,
  type BlockType,
  BLOCK_LABELS,
  ADDABLE_BLOCK_TYPES,
  type GalleryImage,
  type ScheduleItem,
  type GiftItem,
} from "@/features/invitation/types/blocks";
import { GalleryManager, type GalleryItem } from "@/features/admin/components/GalleryManager";

// ── Helpers ─────────────────────────────────────────────────────────────────

function toDateTimeLocalValue(isoDate: string | null | undefined) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 16);
}

function toIsoOrNull(local: string) {
  if (!local) return null;
  return new Date(local).toISOString();
}

function defaultConfig(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "hero": return {};
    case "countdown": return { style: "numbers" };
    case "quote": return { text: "", author: "" };
    case "text": return { heading: "", body: "", alignment: "center" };
    case "photo": return { image_url: "", caption: "", display: "full-width", height: "md" };
    case "gallery": return { images: [], layout: "grid", columns: 3 };
    case "schedule": return { title: "Itinerario", items: [] };
    case "location": return { label: "", address: "", maps_url: "", starts_at: null, show_map: true };
    case "rsvp": return { title: "", subtitle: "" };
    case "divider": return { style: "ornament" };
    case "dress_code": return { title: "", description: "", colors: [] };
    case "gift_registry": return { title: "", items: [] };
  }
}

// ── Per-block config panels ──────────────────────────────────────────────────

function input(className = "") {
  return `rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 ${className}`;
}

function ConfigPanel({
  block,
  onChange,
}: {
  block: PageBlock;
  onChange: (config: Record<string, unknown>) => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfg = block.config as any;
  const set = (key: string, value: unknown) => onChange({ ...cfg, [key]: value });

  switch (block.block_type) {
    case "hero":
      return (
        <p className="text-xs text-zinc-400">
          El encabezado muestra el título del evento, nombres y fecha. Configura estos en la sección superior del formulario.
        </p>
      );

    case "countdown":
      return (
        <label className="flex flex-col gap-1 text-sm">
          Estilo
          <select className={input()} value={cfg.style ?? "numbers"} onChange={(e) => set("style", e.target.value)}>
            <option value="numbers">Números grandes</option>
            <option value="minimal">Minimalista</option>
          </select>
        </label>
      );

    case "quote":
      return (
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            Frase
            <textarea
              className={input("min-h-20")}
              placeholder="Escribe la frase o cita..."
              value={cfg.text ?? ""}
              onChange={(e) => set("text", e.target.value)}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Autor (opcional)
            <input className={input()} placeholder="— Autor" value={cfg.author ?? ""} onChange={(e) => set("author", e.target.value)} />
          </label>
        </div>
      );

    case "text":
      return (
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            Título
            <input className={input()} placeholder="Título de la sección" value={cfg.heading ?? ""} onChange={(e) => set("heading", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Contenido
            <textarea className={input("min-h-24")} placeholder="Texto..." value={cfg.body ?? ""} onChange={(e) => set("body", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Alineación
            <select className={input()} value={cfg.alignment ?? "center"} onChange={(e) => set("alignment", e.target.value)}>
              <option value="left">Izquierda</option>
              <option value="center">Centro</option>
              <option value="right">Derecha</option>
            </select>
          </label>
        </div>
      );

    case "photo":
      return (
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            URL de imagen
            <input className={input()} placeholder="https://..." value={cfg.image_url ?? ""} onChange={(e) => set("image_url", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Pie de foto (opcional)
            <input className={input()} placeholder="Descripción..." value={cfg.caption ?? ""} onChange={(e) => set("caption", e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-sm">
              Modo
              <select className={input()} value={cfg.display ?? "full-width"} onChange={(e) => set("display", e.target.value)}>
                <option value="full-width">Ancho completo</option>
                <option value="contained">Contenida</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Altura
              <select className={input()} value={cfg.height ?? "md"} onChange={(e) => set("height", e.target.value)}>
                <option value="sm">Pequeña</option>
                <option value="md">Mediana</option>
                <option value="lg">Grande</option>
              </select>
            </label>
          </div>
        </div>
      );

    case "gallery": {
      const images: GalleryImage[] = cfg.images ?? [];
      const galleryItems: GalleryItem[] = images.map((img, i) => ({
        image_url: img.image_url,
        caption: img.caption ?? undefined,
        display_order: i,
      }));
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-sm">
              Diseño
              <select className={input()} value={cfg.layout ?? "grid"} onChange={(e) => set("layout", e.target.value)}>
                <option value="grid">Cuadrícula</option>
                <option value="carousel">Carrusel</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Columnas (cuadrícula)
              <select className={input()} value={String(cfg.columns ?? 3)} onChange={(e) => set("columns", Number(e.target.value))}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </label>
          </div>
          <GalleryManager
            items={galleryItems}
            onChange={(items) =>
              set("images", items.map((g) => ({ image_url: g.image_url, caption: g.caption })))
            }
          />
        </div>
      );
    }

    case "schedule": {
      const items: ScheduleItem[] = cfg.items ?? [];
      return (
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            Título del bloque
            <input className={input()} placeholder="Itinerario" value={cfg.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </label>
          {items.map((item, i) => (
            <div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3 space-y-2 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex gap-2">
                <input
                  className={input("flex-1")}
                  placeholder="Título (ej. Ceremonia)"
                  value={item.title}
                  onChange={(e) => {
                    const next = items.map((s, idx) => idx === i ? { ...s, title: e.target.value } : s);
                    set("items", next);
                  }}
                />
                <button
                  type="button"
                  onClick={() => set("items", items.filter((_, idx) => idx !== i))}
                  className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-600"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="datetime-local"
                  className={input()}
                  value={toDateTimeLocalValue(item.starts_at)}
                  onChange={(e) => {
                    const next = items.map((s, idx) => idx === i ? { ...s, starts_at: toIsoOrNull(e.target.value) ?? s.starts_at } : s);
                    set("items", next);
                  }}
                />
                <input
                  type="datetime-local"
                  className={input()}
                  value={toDateTimeLocalValue(item.ends_at)}
                  onChange={(e) => {
                    const next = items.map((s, idx) => idx === i ? { ...s, ends_at: toIsoOrNull(e.target.value) } : s);
                    set("items", next);
                  }}
                />
              </div>
              <textarea
                className={input("w-full")}
                placeholder="Detalles (opcional)"
                value={item.details ?? ""}
                onChange={(e) => {
                  const next = items.map((s, idx) => idx === i ? { ...s, details: e.target.value } : s);
                  set("items", next);
                }}
              />
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600"
            onClick={() =>
              set("items", [
                ...items,
                { title: "", starts_at: new Date().toISOString(), ends_at: null, details: "" },
              ])
            }
          >
            + Agregar momento
          </button>
        </div>
      );
    }

    case "location":
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-sm">
              Etiqueta
              <input className={input()} placeholder="Ej. Recepción" value={cfg.label ?? ""} onChange={(e) => set("label", e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Hora de inicio
              <input
                type="datetime-local"
                className={input()}
                value={toDateTimeLocalValue(cfg.starts_at)}
                onChange={(e) => set("starts_at", toIsoOrNull(e.target.value))}
              />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            Dirección
            <input className={input()} placeholder="Calle, Colonia, Ciudad" value={cfg.address ?? ""} onChange={(e) => set("address", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            URL de Google Maps
            <input className={input()} placeholder="https://maps.google.com/..." value={cfg.maps_url ?? ""} onChange={(e) => set("maps_url", e.target.value)} />
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={cfg.show_map !== false}
              onChange={(e) => set("show_map", e.target.checked)}
              className="rounded"
            />
            Mostrar mapa embebido
          </label>
        </div>
      );

    case "rsvp":
      return (
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            Título
            <input className={input()} placeholder="¿Confirmas tu asistencia?" value={cfg.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Subtítulo
            <input className={input()} placeholder="Tu lugar es importante para nosotros." value={cfg.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} />
          </label>
        </div>
      );

    case "divider":
      return (
        <label className="flex flex-col gap-1 text-sm">
          Estilo
          <select className={input()} value={cfg.style ?? "ornament"} onChange={(e) => set("style", e.target.value)}>
            <option value="ornament">Ornamento</option>
            <option value="line">Línea</option>
            <option value="dots">Puntos</option>
          </select>
        </label>
      );

    case "dress_code": {
      const colors: string[] = cfg.colors ?? [];
      return (
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            Título (opcional)
            <input className={input()} placeholder="Código de vestimenta" value={cfg.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Descripción
            <input className={input()} placeholder="Ej. Formal · Gala · Blanco" value={cfg.description ?? ""} onChange={(e) => set("description", e.target.value)} />
          </label>
          <div className="space-y-1">
            <p className="text-sm">Colores de paleta</p>
            <div className="flex flex-wrap gap-2 items-center">
              {colors.map((color, i) => (
                <div key={i} className="flex items-center gap-1">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const next = colors.map((c, idx) => idx === i ? e.target.value : c);
                      set("colors", next);
                    }}
                    className="w-8 h-8 rounded cursor-pointer border border-zinc-300"
                  />
                  <button
                    type="button"
                    onClick={() => set("colors", colors.filter((_, idx) => idx !== i))}
                    className="text-xs text-zinc-400 hover:text-zinc-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-600"
                onClick={() => set("colors", [...colors, "#e5d3c0"])}
              >
                + Color
              </button>
            </div>
          </div>
        </div>
      );
    }

    case "gift_registry": {
      const items: GiftItem[] = cfg.items ?? [];
      return (
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            Título (opcional)
            <input className={input()} placeholder="Mesa de regalos" value={cfg.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </label>
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input
                className={input("flex-1")}
                placeholder="Nombre (ej. Liverpool)"
                value={item.name}
                onChange={(e) => {
                  const next = items.map((g, idx) => idx === i ? { ...g, name: e.target.value } : g);
                  set("items", next);
                }}
              />
              <input
                className={input("flex-1")}
                placeholder="URL"
                value={item.url}
                onChange={(e) => {
                  const next = items.map((g, idx) => idx === i ? { ...g, url: e.target.value } : g);
                  set("items", next);
                }}
              />
              <button
                type="button"
                onClick={() => set("items", items.filter((_, idx) => idx !== i))}
                className="rounded-lg border border-zinc-300 px-2 text-xs hover:bg-zinc-100 dark:border-zinc-600"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600"
            onClick={() => set("items", [...items, { name: "", url: "" }])}
          >
            + Agregar tienda
          </button>
        </div>
      );
    }

    default:
      return null;
  }
}

// ── Main editor ──────────────────────────────────────────────────────────────

type Props = {
  blocks: PageBlock[];
  onChange: (blocks: PageBlock[]) => void;
};

export function PageBlocksEditor({ blocks, onChange }: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const [showAddMenu, setShowAddMenu] = useState(false);

  function toggleExpand(index: number) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  function moveUp(index: number) {
    if (index === 0) return;
    const next = [...blocks];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next.map((b, i) => ({ ...b, display_order: i })));
  }

  function moveDown(index: number) {
    if (index === blocks.length - 1) return;
    const next = [...blocks];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next.map((b, i) => ({ ...b, display_order: i })));
  }

  function remove(index: number) {
    onChange(blocks.filter((_, i) => i !== index).map((b, i) => ({ ...b, display_order: i })));
  }

  function toggleEnabled(index: number) {
    onChange(blocks.map((b, i) => i === index ? { ...b, enabled: !b.enabled } : b));
  }

  function updateConfig(index: number, config: Record<string, unknown>) {
    onChange(blocks.map((b, i) => i === index ? { ...b, config } : b));
  }

  function addBlock(type: BlockType) {
    const newBlock: PageBlock = {
      block_type: type,
      config: defaultConfig(type),
      display_order: blocks.length,
      enabled: true,
    };
    const nextBlocks = [...blocks, newBlock];
    onChange(nextBlocks);
    setExpanded((prev) => new Set([...prev, nextBlocks.length - 1]));
    setShowAddMenu(false);
  }

  return (
    <section className="space-y-2 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Bloques de la página</h3>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowAddMenu((v) => !v)}
            className="rounded-lg bg-zinc-900 text-white px-3 py-1.5 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >
            + Agregar bloque
          </button>
          {showAddMenu ? (
            <div className="absolute right-0 top-full mt-1 z-10 w-52 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              {ADDABLE_BLOCK_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => addBlock(type)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 first:rounded-t-xl last:rounded-b-xl transition-colors"
                >
                  {BLOCK_LABELS[type]}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {blocks.length === 0 ? (
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No hay bloques. Agrega uno con el botón.</p>
      ) : null}

      {blocks.map((block, index) => {
        const isExpanded = expanded.has(index);
        const isHero = block.block_type === "hero";

        return (
          <div
            key={index}
            className={`rounded-xl border ${block.enabled ? "border-zinc-200 dark:border-zinc-700" : "border-zinc-200/50 opacity-60 dark:border-zinc-700/50"} bg-zinc-50 dark:bg-zinc-800/50`}
          >
            {/* Block header */}
            <div className="flex items-center gap-2 p-3">
              {/* Up / Down arrows */}
              <div className="flex flex-col">
                <button
                  type="button"
                  onClick={() => moveUp(index)}
                  disabled={index === 0}
                  className="text-zinc-400 hover:text-zinc-700 disabled:opacity-20 disabled:cursor-not-allowed leading-none text-sm px-1"
                  title="Subir"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => moveDown(index)}
                  disabled={index === blocks.length - 1}
                  className="text-zinc-400 hover:text-zinc-700 disabled:opacity-20 disabled:cursor-not-allowed leading-none text-sm px-1"
                  title="Bajar"
                >
                  ▼
                </button>
              </div>

              {/* Type label */}
              <button
                type="button"
                onClick={() => toggleExpand(index)}
                className="flex-1 text-left text-sm font-medium truncate"
              >
                {BLOCK_LABELS[block.block_type]}
                {block.block_type === "text" && block.config.heading ? (
                  <span className="ml-2 text-zinc-400 font-normal">— {String(block.config.heading).slice(0, 30)}</span>
                ) : null}
                {block.block_type === "quote" && block.config.text ? (
                  <span className="ml-2 text-zinc-400 font-normal">— &ldquo;{String(block.config.text).slice(0, 30)}&rdquo;</span>
                ) : null}
              </button>

              {/* Enable toggle */}
              <button
                type="button"
                onClick={() => toggleEnabled(index)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                  block.enabled
                    ? "border-emerald-300 text-emerald-700 bg-emerald-50"
                    : "border-zinc-300 text-zinc-400"
                }`}
                title={block.enabled ? "Visible" : "Oculto"}
              >
                {block.enabled ? "Visible" : "Oculto"}
              </button>

              {/* Expand button */}
              <button
                type="button"
                onClick={() => toggleExpand(index)}
                className="text-zinc-400 hover:text-zinc-700 transition-colors px-1 text-sm"
                title={isExpanded ? "Cerrar" : "Editar"}
              >
                {isExpanded ? "▾" : "▸"}
              </button>

              {/* Delete — not for hero */}
              {!isHero ? (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-rose-400 hover:text-rose-600 transition-colors text-sm px-1"
                  title="Eliminar bloque"
                >
                  ✕
                </button>
              ) : null}
            </div>

            {/* Config panel */}
            {isExpanded ? (
              <div className="border-t border-zinc-200 dark:border-zinc-700 p-3">
                <ConfigPanel
                  block={block}
                  onChange={(config) => updateConfig(index, config)}
                />
              </div>
            ) : null}
          </div>
        );
      })}
    </section>
  );
}
