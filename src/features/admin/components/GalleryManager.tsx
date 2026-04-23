"use client";

import { useState, type ChangeEvent } from "react";

export type GalleryItem = {
  image_url: string;
  caption?: string;
  display_order: number;
};

type GalleryManagerProps = {
  items: GalleryItem[];
  onChange: (items: GalleryItem[]) => void;
};

export function GalleryManager({ items, onChange }: GalleryManagerProps) {
  const [uploadStatus, setUploadStatus] = useState("");

  function updateItem(index: number, patch: Partial<GalleryItem>) {
    onChange(items.map((item, idx) => (idx === index ? { ...item, ...patch } : item)));
  }

  function removeItem(index: number) {
    const next = items
      .filter((_, idx) => idx !== index)
      .map((item, idx) => ({ ...item, display_order: idx }));
    onChange(next);
  }

  async function onFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setUploadStatus("Subiendo imagen...");
    try {
      const body = new FormData();
      body.append("file", selectedFile);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body,
      });

      if (!response.ok) {
        const data = (await response.json()) as { message?: string };
        setUploadStatus(data.message ?? "No se pudo subir la imagen.");
        return;
      }

      const data = (await response.json()) as { url: string };
      const nextItem: GalleryItem = {
        image_url: data.url,
        caption: selectedFile.name,
        display_order: items.length,
      };

      onChange([...items, nextItem]);
      setUploadStatus("Imagen subida y agregada a la galería.");
      event.target.value = "";
    } catch {
      setUploadStatus("Error inesperado al subir imagen.");
    }
  }

  return (
    <div className="space-y-2">
      <label className="flex flex-col gap-2 text-sm">
        Subir imagen a galería
        <input type="file" accept="image/*" onChange={onFileChange} className="rounded-lg border border-zinc-300 bg-white p-2 text-sm" />
      </label>
      {uploadStatus ? <p className="text-xs text-zinc-600 dark:text-zinc-300">{uploadStatus}</p> : null}

      <div className="space-y-2 rounded-xl border border-zinc-200 p-3 dark:border-zinc-700">
        <p className="text-sm font-medium">Imágenes cargadas</p>
        {items.length === 0 ? <p className="text-xs text-zinc-500 dark:text-zinc-400">Aún no hay imágenes en la galería.</p> : null}
        {items.map((item, index) => (
          <div
            key={`${item.image_url}-${index}`}
            className="grid gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-3 md:grid-cols-[1fr_220px_auto] dark:border-zinc-700 dark:bg-zinc-800"
          >
            <input className="rounded-md border border-zinc-300 p-2 text-xs" value={item.image_url} readOnly />
            <input
              className="rounded-md border border-zinc-300 p-2 text-sm"
              placeholder="Caption"
              value={item.caption ?? ""}
              onChange={(event) => updateItem(index, { caption: event.target.value })}
            />
            <button
              type="button"
              className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100"
              onClick={() => removeItem(index)}
            >
              Quitar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
