"use client";

import { WEDDING_FONTS, buildAllFontsUrl } from "@/features/themes/fonts";

type FontSelectorProps = {
  value: string;
  onChange: (fontKey: string) => void;
};

export function FontSelector({ value, onChange }: FontSelectorProps) {
  return (
    <div className="space-y-2">
      {/* Load all preview fonts */}
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={buildAllFontsUrl()} />
      <label className="block text-sm font-medium">Tipografía del encabezado</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {WEDDING_FONTS.map((font) => (
          <button
            key={font.key}
            type="button"
            onClick={() => onChange(font.key)}
            className={`flex flex-col items-center gap-1 rounded-xl border-2 p-3 transition-colors ${
              value === font.key
                ? "border-rose-500 bg-rose-50 dark:bg-rose-950/30"
                : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700"
            }`}
          >
            <span
              className="text-xl leading-tight"
              style={{ fontFamily: `'${font.key}', serif` }}
            >
              {font.previewText}
            </span>
            <span className="text-xs text-zinc-500">{font.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
