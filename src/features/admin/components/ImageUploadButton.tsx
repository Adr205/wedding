"use client";

import { useRef, useState, type ChangeEvent } from "react";

type Props = {
  value: string;
  onChange: (url: string) => void;
  className?: string;
};

export function ImageUploadButton({ value, onChange, className = "" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/uploads", { method: "POST", body });
      if (!res.ok) {
        const data = (await res.json()) as { message?: string };
        setError(data.message ?? "Error al subir");
        return;
      }
      const data = (await res.json()) as { url: string };
      onChange(data.url);
    } catch {
      setError("Error inesperado");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-600 dark:hover:bg-zinc-800"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" />
          </svg>
          {uploading ? "Subiendo…" : "Subir"}
        </button>
        <input
          type="url"
          placeholder="O pega URL…"
          className="min-w-0 flex-1 rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
      {value ? (
        <div className="relative h-24 overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-700">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Vista previa" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-2 top-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white hover:bg-black/70"
          >
            Quitar
          </button>
        </div>
      ) : null}
    </div>
  );
}
