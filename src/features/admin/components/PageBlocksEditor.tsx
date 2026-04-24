"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type PageBlock,
  type BlockType,
  type BlockAnimation,
  BLOCK_LABELS,
  ADDABLE_BLOCK_TYPES,
  ANIMATION_LABELS,
  CHILD_BLOCK_TYPES,
  type GalleryImage,
  type ScheduleItem,
  type GiftItem,
} from "@/features/invitation/types/blocks";
import { GalleryManager, type GalleryItem } from "@/features/admin/components/GalleryManager";
import { ImageUploadButton } from "@/features/admin/components/ImageUploadButton";

// ── Helpers ─────────────────────────────────────────────────────────────────

function toDateTimeLocalValue(isoDate: string | null | undefined) {
  if (!isoDate) return "";
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

function toIsoOrNull(local: string) {
  if (!local) return null;
  return new Date(local).toISOString();
}

function defaultConfig(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "hero":         return {};
    case "countdown":    return { style: "numbers" };
    case "quote":        return { text: "", author: "" };
    case "text":         return { heading: "", body: "", alignment: "center" };
    case "photo":        return { image_url: "", caption: "", display: "full-width", height: "md" };
    case "gallery":      return { images: [], layout: "grid", columns: 3 };
    case "schedule":     return { title: "Itinerario", items: [] };
    case "location":     return { label: "", address: "", maps_url: "", starts_at: null, show_map: true };
    case "rsvp":         return { title: "", subtitle: "" };
    case "divider":      return { style: "ornament" };
    case "dress_code":   return { title: "", description: "", colors: [] };
    case "gift_registry":return { title: "", items: [] };
    case "video":        return { url: "", title: "", aspect: "16:9" };
    case "grid":         return { title: "", columns: 2, gap: "md", align: "start", justify: "start", children: [] };
    case "flex":         return { title: "", gap: "md", align: "center", justify: "center", children: [] };
  }
}

function inp(cls = "") {
  return `rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-600 dark:bg-zinc-800 ${cls}`;
}

// ── Animation selector — shared ─────────────────────────────────────────────

function AnimationSelect({ value, onChange }: { value?: BlockAnimation; onChange: (v: BlockAnimation) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs text-zinc-500">
      <span className="shrink-0">Animación:</span>
      <select
        className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-zinc-800"
        value={value ?? "none"}
        onChange={(e) => onChange(e.target.value as BlockAnimation)}
      >
        {(Object.keys(ANIMATION_LABELS) as BlockAnimation[]).map((k) => (
          <option key={k} value={k}>{ANIMATION_LABELS[k]}</option>
        ))}
      </select>
    </label>
  );
}

// ── Mini nested block editor (for grid/flex containers) ────────────────────

function MiniBlocksEditor({
  blocks,
  onChange,
}: {
  blocks: PageBlock[];
  onChange: (b: PageBlock[]) => void;
}) {
  const [showAdd, setShowAdd] = useState(false);

  function addChild(type: BlockType) {
    onChange([...blocks, { block_type: type, config: defaultConfig(type), display_order: blocks.length, enabled: true }]);
    setShowAdd(false);
  }
  function removeChild(i: number) { onChange(blocks.filter((_, idx) => idx !== i)); }
  function updateChild(i: number, config: Record<string, unknown>) {
    onChange(blocks.map((b, idx) => idx === i ? { ...b, config } : b));
  }

  return (
    <div className="space-y-2 border-l-2 border-zinc-200 pl-3 dark:border-zinc-700">
      <p className="text-xs font-medium text-zinc-500">Bloques hijos</p>
      {blocks.map((block, i) => (
        <div key={i} className="rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium flex-1">{BLOCK_LABELS[block.block_type]}</span>
            <button type="button" onClick={() => removeChild(i)} className="text-rose-400 hover:text-rose-600 text-xs">✕</button>
          </div>
          <ConfigPanel block={block} onChange={(cfg) => updateChild(i, cfg)} depth={1} />
        </div>
      ))}
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="rounded-md border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-50 dark:border-zinc-600"
        >
          + Agregar hijo
        </button>
        {showAdd ? (
          <div className="absolute left-0 top-full mt-1 z-10 w-44 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            {CHILD_BLOCK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => addChild(type)}
                className="w-full text-left px-3 py-2 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800 first:rounded-t-xl last:rounded-b-xl"
              >
                {BLOCK_LABELS[type]}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

// ── Per-block config panels ──────────────────────────────────────────────────

function ConfigPanel({
  block,
  onChange,
  depth = 0,
}: {
  block: PageBlock;
  onChange: (config: Record<string, unknown>) => void;
  depth?: number;
}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfg = block.config as any;
  const set = useCallback(
    (key: string, value: unknown) => onChange({ ...cfg, [key]: value }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cfg, onChange],
  );

  switch (block.block_type) {
    case "hero":
      return (
        <div className="space-y-2">
          <p className="text-xs text-zinc-400">
            El encabezado usa el título, nombres y fecha configurados en la sección superior.
          </p>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={cfg.show_date_pill !== false}
              onChange={(e) => set("show_date_pill", e.target.checked)}
              className="rounded"
            />
            Mostrar fecha como pastilla
          </label>
        </div>
      );

    case "countdown":
      return (
        <label className="flex flex-col gap-1 text-sm">
          Estilo
          <select className={inp()} value={cfg.style ?? "numbers"} onChange={(e) => set("style", e.target.value)}>
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
            <textarea className={inp("min-h-16")} placeholder="Escribe la frase…" value={cfg.text ?? ""} onChange={(e) => set("text", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Autor (opcional)
            <input className={inp()} placeholder="— Autor" value={cfg.author ?? ""} onChange={(e) => set("author", e.target.value)} />
          </label>
        </div>
      );

    case "text":
      return (
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            Título
            <input className={inp()} placeholder="Título" value={cfg.heading ?? ""} onChange={(e) => set("heading", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Contenido
            <textarea className={inp("min-h-20")} placeholder="Texto…" value={cfg.body ?? ""} onChange={(e) => set("body", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Alineación
            <select className={inp()} value={cfg.alignment ?? "center"} onChange={(e) => set("alignment", e.target.value)}>
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
          <ImageUploadButton value={cfg.image_url ?? ""} onChange={(url) => set("image_url", url)} />
          <label className="flex flex-col gap-1 text-sm">
            Pie de foto (opcional)
            <input className={inp()} placeholder="Descripción…" value={cfg.caption ?? ""} onChange={(e) => set("caption", e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-sm">
              Modo
              <select className={inp()} value={cfg.display ?? "full-width"} onChange={(e) => set("display", e.target.value)}>
                <option value="full-width">Ancho completo</option>
                <option value="contained">Contenida</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Altura
              <select className={inp()} value={cfg.height ?? "md"} onChange={(e) => set("height", e.target.value)}>
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
              <select className={inp()} value={cfg.layout ?? "grid"} onChange={(e) => set("layout", e.target.value)}>
                <option value="grid">Cuadrícula</option>
                <option value="carousel">Carrusel</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Columnas
              <select className={inp()} value={String(cfg.columns ?? 3)} onChange={(e) => set("columns", Number(e.target.value))}>
                {["1","2","3","4"].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <GalleryManager
            items={galleryItems}
            onChange={(items) => set("images", items.map((g) => ({ image_url: g.image_url, caption: g.caption })))}
          />
        </div>
      );
    }

    case "schedule": {
      const items: ScheduleItem[] = cfg.items ?? [];
      return (
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            Título
            <input className={inp()} placeholder="Itinerario" value={cfg.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </label>
          {items.map((item, i) => (
            <div key={i} className="rounded-lg border border-zinc-200 bg-zinc-50 p-2 space-y-2 dark:border-zinc-700 dark:bg-zinc-800">
              <div className="flex gap-2">
                <input className={inp("flex-1")} placeholder="Título" value={item.title}
                  onChange={(e) => set("items", items.map((s, idx) => idx === i ? { ...s, title: e.target.value } : s))} />
                <button type="button" onClick={() => set("items", items.filter((_, idx) => idx !== i))}
                  className="rounded-lg border border-zinc-300 px-2 text-xs hover:bg-zinc-100 dark:border-zinc-600">✕</button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="datetime-local" className={inp()} value={toDateTimeLocalValue(item.starts_at)}
                  onChange={(e) => set("items", items.map((s, idx) => idx === i ? { ...s, starts_at: toIsoOrNull(e.target.value) ?? s.starts_at } : s))} />
                <input type="datetime-local" className={inp()} value={toDateTimeLocalValue(item.ends_at)}
                  onChange={(e) => set("items", items.map((s, idx) => idx === i ? { ...s, ends_at: toIsoOrNull(e.target.value) } : s))} />
              </div>
              <textarea className={inp("w-full")} placeholder="Detalles (opcional)" value={item.details ?? ""}
                onChange={(e) => set("items", items.map((s, idx) => idx === i ? { ...s, details: e.target.value } : s))} />
            </div>
          ))}
          <button type="button" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600"
            onClick={() => set("items", [...items, { title: "", starts_at: new Date().toISOString(), ends_at: null, details: "" }])}>
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
              <input className={inp()} placeholder="Ej. Recepción" value={cfg.label ?? ""} onChange={(e) => set("label", e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Hora de inicio
              <input type="datetime-local" className={inp()} value={toDateTimeLocalValue(cfg.starts_at)} onChange={(e) => set("starts_at", toIsoOrNull(e.target.value))} />
            </label>
          </div>
          <label className="flex flex-col gap-1 text-sm">
            Dirección
            <input className={inp()} placeholder="Calle, Colonia, Ciudad" value={cfg.address ?? ""} onChange={(e) => set("address", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            URL de Google Maps
            <input className={inp()} placeholder="https://maps.google.com/…" value={cfg.maps_url ?? ""} onChange={(e) => set("maps_url", e.target.value)} />
          </label>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={cfg.show_map !== false} onChange={(e) => set("show_map", e.target.checked)} className="rounded" />
            Mostrar mapa embebido
          </label>
        </div>
      );

    case "rsvp":
      return (
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            Título
            <input className={inp()} placeholder="¿Confirmas tu asistencia?" value={cfg.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Subtítulo
            <input className={inp()} placeholder="Tu lugar es importante para nosotros." value={cfg.subtitle ?? ""} onChange={(e) => set("subtitle", e.target.value)} />
          </label>
        </div>
      );

    case "divider":
      return (
        <label className="flex flex-col gap-1 text-sm">
          Estilo
          <select className={inp()} value={cfg.style ?? "ornament"} onChange={(e) => set("style", e.target.value)}>
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
            <input className={inp()} placeholder="Código de vestimenta" value={cfg.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Descripción
            <input className={inp()} placeholder="Ej. Formal · Gala · Blanco" value={cfg.description ?? ""} onChange={(e) => set("description", e.target.value)} />
          </label>
          <div className="space-y-1">
            <p className="text-sm">Colores de paleta</p>
            <div className="flex flex-wrap gap-2 items-center">
              {colors.map((color, i) => (
                <div key={i} className="flex items-center gap-1">
                  <input type="color" value={color}
                    onChange={(e) => set("colors", colors.map((c, idx) => idx === i ? e.target.value : c))}
                    className="w-8 h-8 rounded cursor-pointer border border-zinc-300" />
                  <button type="button" onClick={() => set("colors", colors.filter((_, idx) => idx !== i))}
                    className="text-xs text-zinc-400 hover:text-zinc-700">✕</button>
                </div>
              ))}
              <button type="button" className="rounded-lg border border-zinc-300 px-2 py-1 text-xs hover:bg-zinc-100 dark:border-zinc-600"
                onClick={() => set("colors", [...colors, "#e5d3c0"])}>+ Color</button>
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
            <input className={inp()} placeholder="Mesa de regalos" value={cfg.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </label>
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <input className={inp("flex-1")} placeholder="Nombre (ej. Liverpool)" value={item.name}
                onChange={(e) => set("items", items.map((g, idx) => idx === i ? { ...g, name: e.target.value } : g))} />
              <input className={inp("flex-1")} placeholder="URL" value={item.url}
                onChange={(e) => set("items", items.map((g, idx) => idx === i ? { ...g, url: e.target.value } : g))} />
              <button type="button" onClick={() => set("items", items.filter((_, idx) => idx !== i))}
                className="rounded-lg border border-zinc-300 px-2 text-xs hover:bg-zinc-100 dark:border-zinc-600">✕</button>
            </div>
          ))}
          <button type="button" className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-100 dark:border-zinc-600"
            onClick={() => set("items", [...items, { name: "", url: "" }])}>
            + Agregar tienda
          </button>
        </div>
      );
    }

    case "video":
      return (
        <div className="space-y-2">
          <label className="flex flex-col gap-1 text-sm">
            URL (YouTube o Vimeo)
            <input className={inp()} placeholder="https://youtube.com/watch?v=..." value={cfg.url ?? ""} onChange={(e) => set("url", e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-sm">
              Título (opcional)
              <input className={inp()} placeholder="Nuestro video…" value={cfg.title ?? ""} onChange={(e) => set("title", e.target.value)} />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Proporción
              <select className={inp()} value={cfg.aspect ?? "16:9"} onChange={(e) => set("aspect", e.target.value)}>
                <option value="16:9">16:9 (paisaje)</option>
                <option value="4:3">4:3</option>
                <option value="1:1">1:1 (cuadrado)</option>
              </select>
            </label>
          </div>
        </div>
      );

    case "grid": {
      const children: PageBlock[] = cfg.children ?? [];
      return (
        <div className="space-y-3">
          <label className="flex flex-col gap-1 text-sm">
            Título (opcional)
            <input className={inp()} placeholder="Ej. Nuestro equipo" value={cfg.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="flex flex-col gap-1 text-sm">
              Columnas
              <select className={inp()} value={String(cfg.columns ?? 2)} onChange={(e) => set("columns", Number(e.target.value))}>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Espaciado
              <select className={inp()} value={cfg.gap ?? "md"} onChange={(e) => set("gap", e.target.value)}>
                <option value="sm">Pequeño</option>
                <option value="md">Mediano</option>
                <option value="lg">Grande</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Alinear filas (align-items)
              <select className={inp()} value={cfg.align ?? "start"} onChange={(e) => set("align", e.target.value)}>
                <option value="start">Inicio</option>
                <option value="center">Centro</option>
                <option value="end">Final</option>
                <option value="stretch">Estirar</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Alinear columnas (justify-items)
              <select className={inp()} value={cfg.justify ?? "start"} onChange={(e) => set("justify", e.target.value)}>
                <option value="start">Inicio</option>
                <option value="center">Centro</option>
                <option value="end">Final</option>
                <option value="between">Estirar</option>
              </select>
            </label>
          </div>
          {depth === 0 ? (
            <MiniBlocksEditor blocks={children} onChange={(b) => set("children", b)} />
          ) : (
            <p className="text-xs text-zinc-400">No se admite anidamiento de contenedores.</p>
          )}
        </div>
      );
    }

    case "flex": {
      const children: PageBlock[] = cfg.children ?? [];
      return (
        <div className="space-y-3">
          <label className="flex flex-col gap-1 text-sm">
            Título (opcional)
            <input className={inp()} placeholder="Ej. Nuestros padrinos" value={cfg.title ?? ""} onChange={(e) => set("title", e.target.value)} />
          </label>
          <div className="grid grid-cols-3 gap-2">
            <label className="flex flex-col gap-1 text-sm">
              Espaciado
              <select className={inp()} value={cfg.gap ?? "md"} onChange={(e) => set("gap", e.target.value)}>
                <option value="sm">Pequeño</option>
                <option value="md">Mediano</option>
                <option value="lg">Grande</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Alinear (align-items)
              <select className={inp()} value={cfg.align ?? "center"} onChange={(e) => set("align", e.target.value)}>
                <option value="start">Inicio</option>
                <option value="center">Centro</option>
                <option value="end">Final</option>
                <option value="stretch">Estirar</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Distribuir (justify-content)
              <select className={inp()} value={cfg.justify ?? "center"} onChange={(e) => set("justify", e.target.value)}>
                <option value="start">Inicio</option>
                <option value="center">Centro</option>
                <option value="end">Final</option>
                <option value="between">Entre</option>
              </select>
            </label>
          </div>
          {depth === 0 ? (
            <MiniBlocksEditor blocks={children} onChange={(b) => set("children", b)} />
          ) : (
            <p className="text-xs text-zinc-400">No se admite anidamiento de contenedores.</p>
          )}
        </div>
      );
    }

    default:
      return null;
  }
}

// ── Sortable block item ──────────────────────────────────────────────────────

function SortableBlockItem({
  block,
  dndId,
  index,
  total,
  expanded,
  onToggleExpand,
  onToggleEnabled,
  onRemove,
  onUpdateConfig,
  onUpdateAnimation,
}: {
  block: PageBlock;
  dndId: string;
  index: number;
  total: number;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleEnabled: () => void;
  onRemove: () => void;
  onUpdateConfig: (cfg: Record<string, unknown>) => void;
  onUpdateAnimation: (a: BlockAnimation) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: dndId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const isHero = block.block_type === "hero";

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border ${
        block.enabled ? "border-zinc-200 dark:border-zinc-700" : "border-zinc-200/50 opacity-60 dark:border-zinc-700/50"
      } bg-zinc-50 dark:bg-zinc-800/50`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 p-3">
        {/* Drag handle */}
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-500 px-1 touch-none"
          title="Arrastrar"
          {...attributes}
          {...listeners}
        >
          ⠿
        </button>

        {/* Label */}
        <button type="button" onClick={onToggleExpand} className="flex-1 text-left text-sm font-medium truncate">
          {BLOCK_LABELS[block.block_type]}
          {block.block_type === "text" && block.config.heading ? (
            <span className="ml-2 text-zinc-400 font-normal">— {String(block.config.heading).slice(0, 30)}</span>
          ) : null}
          {block.block_type === "quote" && block.config.text ? (
            <span className="ml-2 text-zinc-400 font-normal">— &ldquo;{String(block.config.text).slice(0, 25)}&rdquo;</span>
          ) : null}
        </button>

        {/* Visible toggle */}
        <button
          type="button"
          onClick={onToggleEnabled}
          className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
            block.enabled
              ? "border-emerald-300 text-emerald-700 bg-emerald-50"
              : "border-zinc-300 text-zinc-400"
          }`}
        >
          {block.enabled ? "Visible" : "Oculto"}
        </button>

        {/* Expand */}
        <button type="button" onClick={onToggleExpand} className="text-zinc-400 hover:text-zinc-700 px-1 text-sm">
          {expanded ? "▾" : "▸"}
        </button>

        {/* Delete */}
        {!isHero ? (
          <button type="button" onClick={onRemove} className="text-rose-400 hover:text-rose-600 text-sm px-1">
            ✕
          </button>
        ) : null}
      </div>

      {/* Config panel */}
      {expanded ? (
        <div className="border-t border-zinc-200 dark:border-zinc-700 p-3 space-y-3">
          <AnimationSelect value={block.animation} onChange={onUpdateAnimation} />
          <ConfigPanel block={block} onChange={onUpdateConfig} />
        </div>
      ) : null}
    </div>
  );
}

// ── Main editor ──────────────────────────────────────────────────────────────

type Props = {
  blocks: PageBlock[];
  onChange: (blocks: PageBlock[]) => void;
};

export function PageBlocksEditor({ blocks, onChange }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [showAddMenu, setShowAddMenu] = useState(false);
  // Stable DnD keys per block — must use setState to give SortableContext a new array ref on reorder
  const [dndKeys, setDndKeys] = useState<string[]>(() =>
    blocks.map((b) => b.id ?? crypto.randomUUID()),
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function toggleExpand(key: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = dndKeys.indexOf(active.id as string);
    const newIndex = dndKeys.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;

    setDndKeys(arrayMove(dndKeys, oldIndex, newIndex));
    onChange(
      arrayMove(blocks, oldIndex, newIndex).map((b, i) => ({ ...b, display_order: i })),
    );
  }

  function remove(index: number) {
    setDndKeys(dndKeys.filter((_, i) => i !== index));
    onChange(blocks.filter((_, i) => i !== index).map((b, i) => ({ ...b, display_order: i })));
  }

  function toggleEnabled(index: number) {
    onChange(blocks.map((b, i) => (i === index ? { ...b, enabled: !b.enabled } : b)));
  }

  function updateConfig(index: number, config: Record<string, unknown>) {
    onChange(blocks.map((b, i) => (i === index ? { ...b, config } : b)));
  }

  function updateAnimation(index: number, animation: BlockAnimation) {
    onChange(blocks.map((b, i) => (i === index ? { ...b, animation } : b)));
  }

  function addBlock(type: BlockType) {
    const newKey = crypto.randomUUID();
    setDndKeys([...dndKeys, newKey]);
    const newBlock: PageBlock = {
      block_type: type,
      config: defaultConfig(type),
      display_order: blocks.length,
      enabled: true,
    };
    const next = [...blocks, newBlock];
    onChange(next);
    setExpanded((prev) => new Set([...prev, newKey]));
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
            <div className="absolute right-0 top-full mt-1 z-10 w-52 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900 max-h-72 overflow-y-auto">
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
        <p className="text-sm text-zinc-500 dark:text-zinc-400">No hay bloques. Agrega uno.</p>
      ) : null}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dndKeys} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {blocks.map((block, index) => {
              const key = dndKeys[index] ?? String(index);
              return (
                <SortableBlockItem
                  key={key}
                  block={block}
                  dndId={key}
                  index={index}
                  total={blocks.length}
                  expanded={expanded.has(key)}
                  onToggleExpand={() => toggleExpand(key)}
                  onToggleEnabled={() => toggleEnabled(index)}
                  onRemove={() => remove(index)}
                  onUpdateConfig={(cfg) => updateConfig(index, cfg)}
                  onUpdateAnimation={(a) => updateAnimation(index, a)}
                />
              );
            })}
          </div>
        </SortableContext>
      </DndContext>
    </section>
  );
}
