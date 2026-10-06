"use client";

import type { ReactNode } from "react";
import { FontSelector } from "@/features/admin/components/FontSelector";
import { ImageUploadButton } from "@/features/admin/components/ImageUploadButton";
import { DEFAULT_ENVELOPE, type EnvelopeConfig } from "@/features/invitation/types/envelope";

type Props = {
  value: EnvelopeConfig;
  onChange: (next: EnvelopeConfig) => void;
};

export function EnvelopeEditor({ value, onChange }: Props) {
  function patch<K extends keyof EnvelopeConfig>(key: K, next: EnvelopeConfig[K]) {
    onChange({ ...value, [key]: next });
  }

  return (
    <div className="space-y-3 rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-semibold text-sm">Portada con sobre</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Si la activas, los invitados verán primero un sobre cerrado. Al hacer clic se abre la invitación.
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm shrink-0 cursor-pointer">
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={value.enabled}
            onChange={(e) => patch("enabled", e.target.checked)}
          />
          Activar
        </label>
      </div>

      {value.enabled ? (
        <div className="space-y-4 pt-2">
          <p className="text-xs text-zinc-500">
            Si dejas vacíos los nombres o la fecha, se toman de los datos del evento.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nombres">
              <input
                className={inp()}
                placeholder="Oscar y Rocío"
                value={value.names ?? ""}
                onChange={(e) => patch("names", e.target.value)}
              />
            </Field>
            <Field label="Fecha">
              <input
                className={inp()}
                placeholder="17/10/2026"
                value={value.date_label ?? ""}
                onChange={(e) => patch("date_label", e.target.value)}
              />
            </Field>
          </div>

          <FontSelector
            label="Tipografía del sobre"
            value={value.font_key || "Great Vibes"}
            onChange={(fontKey) => patch("font_key", fontKey)}
          />

          <Field label="Texto debajo del sobre">
            <input
              className={inp()}
              placeholder={DEFAULT_ENVELOPE.hint ?? ""}
              value={value.hint ?? ""}
              onChange={(e) => patch("hint", e.target.value)}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <ColorField
              label="Fondo de la portada"
              value={value.background_color || DEFAULT_ENVELOPE.background_color!}
              onChange={(color) => patch("background_color", color)}
            />
            <ColorField
              label="Texto"
              value={value.text_color || DEFAULT_ENVELOPE.text_color!}
              onChange={(color) => patch("text_color", color)}
            />
          </div>

          <div className="space-y-3 rounded-lg border border-zinc-200 p-3 dark:border-zinc-700">
            <p className="text-sm font-medium">Diseño del sobre</p>
            <div className="flex gap-2">
              <FillToggle
                active={(value.envelope_fill ?? "color") !== "image"}
                onClick={() => patch("envelope_fill", "color")}
              >
                Color
              </FillToggle>
              <FillToggle
                active={value.envelope_fill === "image"}
                onClick={() => patch("envelope_fill", "image")}
              >
                Imagen / textura
              </FillToggle>
            </div>
            {(value.envelope_fill ?? "color") !== "image" ? (
              <ColorField
                label="Color del sobre"
                value={value.envelope_color || DEFAULT_ENVELOPE.envelope_color!}
                onChange={(color) => patch("envelope_color", color)}
              />
            ) : (
              <div className="space-y-1">
                <p className="text-sm">Imagen del sobre</p>
                <p className="text-xs text-zinc-500">
                  Sube una textura o un diseño. Se recorta con la forma del sobre.
                </p>
                <ImageUploadButton
                  value={value.envelope_image_url ?? ""}
                  onChange={(url) => patch("envelope_image_url", url)}
                />
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function FillToggle({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
        active
          ? "border-rose-400 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-100"
          : "border-zinc-300 hover:bg-zinc-50 dark:border-zinc-600 dark:hover:bg-zinc-800"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      {children}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="flex items-center gap-2">
        {label}
        <input
          type="color"
          value={toColorInput(value)}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-zinc-300"
        />
      </span>
      <input
        className={inp()}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}

function inp() {
  return "rounded-lg border border-zinc-300 p-2 text-sm dark:border-zinc-600 dark:bg-zinc-800";
}

function toColorInput(value: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : "#ffffff";
}
