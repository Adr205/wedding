import type { EventRow } from "@/features/invitation/types";
import { formatEventDateSlash } from "@/lib/dates";

export type EnvelopeConfig = {
  enabled: boolean;
  headline?: string | null;
  initials?: string | null;
  names?: string | null;
  date_label?: string | null;
  background_color?: string | null;
  envelope_color?: string | null;
  text_color?: string | null;
  seal_color?: string | null;
  photo_url?: string | null;
  card_photo_url?: string | null;
  card_text?: string | null;
  tag_label?: string | null;
  hint?: string | null;
  font_key?: string | null;
  envelope_fill?: "color" | "image" | null;
  envelope_image_url?: string | null;
};

export const DEFAULT_ENVELOPE: EnvelopeConfig = {
  enabled: false,
  headline: "",
  initials: "",
  names: "",
  date_label: "",
  background_color: "#FFFFFF",
  envelope_color: "#F3EBDD",
  text_color: "#2A2A2A",
  seal_color: "#D4B06A",
  photo_url: "",
  card_photo_url: "",
  card_text: "Haz clic para ver los detalles",
  tag_label: "Save the Date",
  hint: "Da clic para abrir la invitación",
  font_key: "",
  envelope_fill: "color",
  envelope_image_url: "",
};

export function mergeEnvelope(partial?: Partial<EnvelopeConfig> | null): EnvelopeConfig {
  return { ...DEFAULT_ENVELOPE, ...partial, enabled: Boolean(partial?.enabled) };
}

function splitHonorees(names: string): string[] {
  return names
    .split(/\s*(?:&| y | and | e )\s*/i)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function formatEnvelopeDate(isoDate: string, timeZone?: string | null): string {
  return formatEventDateSlash(isoDate, timeZone);
}

export type ResolvedEnvelope = {
  enabled: boolean;
  displayName: string;
  dateLabel: string;
  backgroundColor: string;
  envelopeColor: string;
  textColor: string;
  sealColor: string;
  hint: string;
  fontKey: string;
  envelopeFill: "color" | "image";
  envelopeImageUrl: string;
};

export function resolveEnvelope(config: EnvelopeConfig, event: EventRow): ResolvedEnvelope {
  const names = (config.names || event.honoree_names || "").trim();
  const nameLines = splitHonorees(names);

  return {
    enabled: Boolean(config.enabled),
    displayName: nameLines.length >= 2 ? nameLines.join(" y ") : names,
    dateLabel: (config.date_label || formatEnvelopeDate(event.main_date, event.timezone)).trim(),
    backgroundColor: config.background_color || DEFAULT_ENVELOPE.background_color!,
    envelopeColor: config.envelope_color || DEFAULT_ENVELOPE.envelope_color!,
    textColor: config.text_color || DEFAULT_ENVELOPE.text_color!,
    sealColor: config.seal_color || DEFAULT_ENVELOPE.seal_color!,
    hint: (config.hint || DEFAULT_ENVELOPE.hint!).trim(),
    fontKey: (config.font_key || "").trim(),
    envelopeFill: config.envelope_fill === "image" ? "image" : "color",
    envelopeImageUrl: (config.envelope_image_url || "").trim(),
  };
}
