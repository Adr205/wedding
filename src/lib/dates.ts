/** Default wedding-event timezone when none is stored. */
export const DEFAULT_EVENT_TZ = "America/Mexico_City";

function resolveTz(timeZone?: string | null): string {
  return timeZone?.trim() || DEFAULT_EVENT_TZ;
}

function asDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d;
}

function fmt(
  date: Date,
  timeZone: string | null | undefined,
  options: Intl.DateTimeFormatOptions,
  locale = "es-MX",
): string {
  return new Intl.DateTimeFormat(locale, { ...options, timeZone: resolveTz(timeZone) }).format(date);
}

/** Day number in the event timezone, e.g. "20" */
export function formatEventDay(iso: string, timeZone?: string | null): string {
  const d = asDate(iso);
  if (!d) return "";
  return fmt(d, timeZone, { day: "numeric" });
}

/** Month name in the event timezone, e.g. "noviembre" */
export function formatEventMonth(iso: string, timeZone?: string | null): string {
  const d = asDate(iso);
  if (!d) return "";
  return fmt(d, timeZone, { month: "long" });
}

/** Year in the event timezone, e.g. "2026" */
export function formatEventYear(iso: string, timeZone?: string | null): string {
  const d = asDate(iso);
  if (!d) return "";
  return fmt(d, timeZone, { year: "numeric" });
}

/** 24h time in the event timezone, e.g. "15:00" */
export function formatEventTime(iso: string, timeZone?: string | null): string {
  const d = asDate(iso);
  if (!d) return "";
  return fmt(d, timeZone, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
}

/** e.g. "viernes 20 nov · 15:00" */
export function formatEventWeekdayShort(iso: string, timeZone?: string | null): string {
  const d = asDate(iso);
  if (!d) return "";
  const datePart = fmt(d, timeZone, { weekday: "long", day: "numeric", month: "short" });
  return `${datePart} · ${formatEventTime(iso, timeZone)}`;
}

/** e.g. "viernes 20 de noviembre · 15:00" */
export function formatEventWeekdayLong(iso: string, timeZone?: string | null): string {
  const d = asDate(iso);
  if (!d) return "";
  const weekday = fmt(d, timeZone, { weekday: "long" });
  const day = formatEventDay(iso, timeZone);
  const month = formatEventMonth(iso, timeZone);
  return `${weekday} ${day} de ${month} · ${formatEventTime(iso, timeZone)}`;
}

/** e.g. "20/11/2026" for envelope fallback */
export function formatEventDateSlash(iso: string, timeZone?: string | null): string {
  const d = asDate(iso);
  if (!d) return "";
  const pad = (n: string) => n.padStart(2, "0");
  const parts = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: resolveTz(timeZone),
  }).formatToParts(d);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${pad(get("day"))}/${pad(get("month"))}/${get("year")}`;
}

/** Calendar date for admin lists, e.g. "20 nov 2026" */
export function formatEventDateMedium(iso: string, timeZone?: string | null): string {
  const d = asDate(iso);
  if (!d) return "";
  return fmt(d, timeZone, { day: "numeric", month: "short", year: "numeric" });
}

/** Value for `<input type="datetime-local">` in the browser's local timezone. */
export function toDateTimeLocalValue(iso: string | null | undefined): string {
  const d = asDate(iso);
  if (!d) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

/** Convert datetime-local string to UTC ISO for storage. */
export function dateTimeLocalToIso(local: string): string | null {
  if (!local) return null;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}
