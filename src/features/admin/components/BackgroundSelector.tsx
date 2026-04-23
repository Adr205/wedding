"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { PRESET_BACKGROUNDS } from "@/features/themes/backgrounds";

type BackgroundSelectorProps = {
  backgroundImageUrl: string | null;
  defaultBackgroundKey: string | null;
  onChangePreset: (key: string | null) => void;
  onChangeCustomUrl: (url: string) => void;
};

export function BackgroundSelector({
  backgroundImageUrl,
  defaultBackgroundKey,
  onChangePreset,
  onChangeCustomUrl,
}: BackgroundSelectorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/uploads", { method: "POST", body });

      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setUploadError(data.message ?? "No se pudo subir la imagen");
        return;
      }

      const data = (await res.json()) as { url: string };
      onChangeCustomUrl(data.url);
      onChangePreset(null);
    } catch {
      setUploadError("Error inesperado al subir la imagen");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const hasCustom = !!backgroundImageUrl;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Imagen de fondo</label>

      {/* Preset grid */}
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-7">
        <button
          type="button"
          onClick={() => { onChangePreset(null); onChangeCustomUrl(""); }}
          className={`flex h-16 items-center justify-center rounded-xl border-2 text-xs transition-colors ${
            !backgroundImageUrl && !defaultBackgroundKey
              ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
              : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700"
          }`}
        >
          Sin fondo
        </button>

        {PRESET_BACKGROUNDS.map((bg) => (
          <button
            key={bg.key}
            type="button"
            onClick={() => { onChangePreset(bg.key); onChangeCustomUrl(""); }}
            className={`relative h-16 overflow-hidden rounded-xl border-2 transition-colors ${
              defaultBackgroundKey === bg.key && !backgroundImageUrl
                ? "border-rose-500"
                : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700"
            }`}
            title={bg.name}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={bg.url} alt={bg.name} className="h-full w-full object-cover" />
            <span className="absolute inset-x-0 bottom-0 bg-black/50 py-0.5 text-center text-[10px] text-white">
              {bg.name}
            </span>
          </button>
        ))}
      </div>

      {/* Upload + URL row */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          {uploading ? "Subiendo…" : "Subir imagen"}
        </button>

        <input
          type="url"
          placeholder="O pega una URL…"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          value={backgroundImageUrl ?? ""}
          onChange={(e) => {
            onChangeCustomUrl(e.target.value);
            if (e.target.value) onChangePreset(null);
          }}
        />
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {uploadError ? <p className="text-xs text-red-500">{uploadError}</p> : null}

      {/* Preview of custom/uploaded image */}
      {hasCustom ? (
        <div className="relative h-28 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={backgroundImageUrl!} alt="Fondo personalizado" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChangeCustomUrl("")}
            className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-1 text-xs text-white hover:bg-black/70"
          >
            Quitar
          </button>
          <span className="absolute left-2 top-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white">
            Imagen personalizada
          </span>
        </div>
      ) : null}
    </div>
  );
}
