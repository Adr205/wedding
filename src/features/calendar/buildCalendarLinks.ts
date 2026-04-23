function toUtcString(dateIso: string) {
  return new Date(dateIso).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
}

export function buildGoogleCalendarLink({
  title,
  startIso,
  endIso,
  details,
  location,
}: {
  title: string;
  startIso: string;
  endIso?: string;
  details?: string;
  location?: string;
}) {
  const start = toUtcString(startIso);
  const end = toUtcString(endIso ?? new Date(new Date(startIso).getTime() + 60 * 60 * 1000).toISOString());

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${start}/${end}`,
    details: details ?? "",
    location: location ?? "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildIcsFile({
  title,
  startIso,
  endIso,
  details,
  location,
}: {
  title: string;
  startIso: string;
  endIso?: string;
  details?: string;
  location?: string;
}) {
  const dtStart = toUtcString(startIso);
  const dtEnd = toUtcString(endIso ?? new Date(new Date(startIso).getTime() + 60 * 60 * 1000).toISOString());

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//AvCenter//Invitaciones//ES",
    "BEGIN:VEVENT",
    `UID:${crypto.randomUUID()}`,
    `DTSTAMP:${toUtcString(new Date().toISOString())}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${details ?? ""}`,
    `LOCATION:${location ?? ""}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
