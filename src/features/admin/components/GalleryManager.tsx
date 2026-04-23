"use client";

import { useRef, useState, type ChangeEvent, type DragEvent } from "react";

export type GalleryItem = {
  image_url: string;
  caption?: string;
  display_order: number;
};

type UploadState = { name: string; status: "uploading" | "error"; message?: string };

type GalleryManagerProps = {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
};

async function uploadFile(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);
  const res = await fetch("/api/admin/uploads", { method: "POST", body });
  if (!res.ok) {
    const data = (await res.json()) as { message?: string };
    throw new Error(data.message ?? "Error al subir");
  }
  const data = (await res.json()) as { url: string };
  return data.url;
}

export function GalleryManager({ items, onChange }: GalleryManagerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [draggingOver, setDraggingOver] = useState(false);

  function updateItem(index: number, patch: Partial<GalleryItem>) {
    onChange(items.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    onChange(
      items
        .filter((_, idx) => idx !== index)
        .map((item, idx) => ({ ...item, display_order: idx })),
    );
  }

  async function handleFiles(files: FileList | File[]) {
    const fileArr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    if (!fileArr.length) return;

    const pending: UploadState[] = fileArr.map((f) => ({ name: f.name, status: "uploading" }));
    setUploads((prev) => [...prev, ...pending]);

    const results = await Promise.allSettled(fileArr.map(uploadFile));

    const newItems: GalleryItem[] = [];
    const nextUploads: UploadState[] = [];

    results.forEach((result, i) => {
      if (result.status === "fulfilled") {
        newItems.push({
          image_url: result.value,
          caption: fileArr[i]!.name.replace(/\.[^.]+$/, ""),
          display_order: items.length + newItems.length,
        });
      } else {
        nextUploads.push({
          name: fileArr[i]!.name,
          status: "error",
          message: result.reason instanceof Error ? result.reason.message : "Error",
        });
      }
    });

    setUploads((prev) => {
      const withoutPending = prev.filter((u) => !fileArr.some((f) => f.name === u.name && u.status === "uploading"));
      return [...withoutPending, ...nextUploads];
    });

    if (newItems.length > 0) onChange([...items, ...newItems]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(e.target.files);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDraggingOver(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }

  const hasErrors = uploads.some((u) => u.status === "error");

  return (
    <section className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Galería de fotos</h3>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="rounded-lg border border-zinc-300 px-3 py-1 text-sm hover:bg-zinc-100 dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          + Subir fotos
        </button>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDraggingOver(true); }}
        onDragLeave={() => setDraggingOver(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 transition-colors ${
          draggingOver
            ? "border-rose-400 bg-rose-50 dark:bg-rose-950/20"
            : "border-zinc-300 hover:border-zinc-400 dark:border-zinc-600"
        }`}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-30">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p className="text-sm text-zinc-500">Arrastra imágenes aquí o haz clic para seleccionar</p>
        <p className="text-xs text-zinc-400">Puedes subir varias a la vez</p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onFileChange}
      />

      {/* Upload errors */}
      {hasErrors ? (
        <div className="space-y-1">
          {uploads.filter((u) => u.status === "error").map((u, i) => (
            <p key={i} className="text-xs text-red-500">
              {u.name}: {u.message}
            </p>
          ))}
          <button type="button" className="text-xs text-zinc-400 underline" onClick={() => setUploads([])}>
            Limpiar errores
          </button>
        </div>
      ) : null}

      {/* Uploading indicators */}
      {uploads.some((u) => u.status === "uploading") ? (
        <p className="text-xs text-zinc-500">
          Subiendo {uploads.filter((u) => u.status === "uploading").length} imagen(es)…
        </p>
      ) : null}

      {/* Thumbnail grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item, index) => (
            <div key={`${item.image_url}-${index}`} className="group relative overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image_url}
                alt={item.caption ?? "foto"}
                className="h-32 w-full object-cover"
              />
              {/* Overlay with actions */}
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                <input
                  className="w-full rounded-md bg-white/20 px-2 py-1 text-xs text-white placeholder:text-white/60 backdrop-blur-sm focus:outline-none focus:ring-1 focus:ring-white/50"
                  placeholder="Caption…"
                  value={item.caption ?? ""}
                  onChange={(e) => updateItem(index, { caption: e.target.value })}
                />
              </div>
              {/* Remove button */}
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:bg-black/70 group-hover:opacity-100"
                title="Eliminar"
              >
                <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              {/* Order badge */}
              <span className="absolute left-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/40 text-[10px] text-white">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-400 dark:text-zinc-500">Aún no hay imágenes en la galería.</p>
      )}
    </section>
  );
}
