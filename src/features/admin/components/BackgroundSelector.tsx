"use client";

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
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">Imagen de fondo</label>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        <button
          type="button"
          onClick={() => {
            onChangePreset(null);
            onChangeCustomUrl("");
          }}
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
            onClick={() => {
              onChangePreset(bg.key);
              onChangeCustomUrl("");
            }}
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

      <div className="flex flex-col gap-1">
        <label className="text-xs text-zinc-500">O pega una URL de imagen personalizada</label>
        <input
          type="url"
          placeholder="https://..."
          className="rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-600 dark:bg-zinc-800"
          value={backgroundImageUrl ?? ""}
          onChange={(e) => {
            onChangeCustomUrl(e.target.value);
            if (e.target.value) onChangePreset(null);
          }}
        />
      </div>
    </div>
  );
}
