import type { Metadata } from "next";
import type { FullInvitation } from "@/features/invitation/types";
import { resolveBackgroundUrl } from "@/features/themes/backgrounds";
import { formatEventDateMedium, formatEventTime } from "@/lib/dates";
import { buildCalendarTitle } from "@/features/calendar/buildCalendarLinks";

function siteOrigin(): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");
  if (base) return base;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

function shareImageUrl(invitation: FullInvitation): string | null {
  const envelope = invitation.theme.block_config?.envelope;
  const fromEnvelope =
    envelope?.photo_url?.trim() ||
    envelope?.card_photo_url?.trim() ||
    "";
  if (fromEnvelope) return fromEnvelope;

  return resolveBackgroundUrl(
    invitation.theme.background_image_url,
    invitation.theme.default_background_key,
  );
}

function shareDescription(invitation: FullInvitation): string {
  const { event } = invitation;
  const date = formatEventDateMedium(event.main_date, event.timezone);
  const time = formatEventTime(event.main_date, event.timezone);
  const when = [date, time ? `${time} hrs` : ""].filter(Boolean).join(" · ");

  if (event.event_type === "wedding") {
    return [
      `Te invitamos a celebrar la boda de ${event.honoree_names || event.title}.`,
      when ? `Fecha: ${when}.` : null,
      "¡Esperamos contar contigo!",
    ]
      .filter(Boolean)
      .join(" ");
  }

  if (event.event_type === "xv") {
    return [
      `Te invitamos a los XV años de ${event.honoree_names || event.title}.`,
      when ? `Fecha: ${when}.` : null,
      "¡Esperamos contar contigo!",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return [
    `Te invitamos a ${event.title}.`,
    when ? `Fecha: ${when}.` : null,
    "¡Esperamos contar contigo!",
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildInvitationMetadata(invitation: FullInvitation): Metadata {
  const title = buildCalendarTitle(invitation.event.title, invitation.event.event_type);
  const description = shareDescription(invitation);
  const image = shareImageUrl(invitation);
  const origin = siteOrigin();
  const url = `${origin}/i/${invitation.event.slug}`;

  return {
    title,
    description,
    metadataBase: new URL(origin),
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url,
      siteName: "AvCenter Invitaciones",
      title,
      description,
      ...(image
        ? {
            images: [
              {
                url: image,
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
}
