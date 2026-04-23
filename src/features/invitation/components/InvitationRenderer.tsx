import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getThemeByKey } from "@/features/themes/registry";
import type { FullInvitation } from "@/features/invitation/types";
import { RsvpButtons } from "@/features/invitation/components/RsvpButtons";
import { CountdownTimer } from "@/features/invitation/components/CountdownTimer";
import { resolveBackgroundUrl } from "@/features/themes/backgrounds";
import { buildFontUrl } from "@/features/themes/fonts";

type InvitationRendererProps = {
  invitation: FullInvitation;
};

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
      <div className="flex-1 max-w-24 h-px bg-current opacity-15" />
      <svg
        width="12"
        height="12"
        viewBox="0 0 14 14"
        fill="currentColor"
        className="opacity-25 shrink-0"
      >
        <path d="M7 0 l1.8 5.4 H14 l-4.7 3.4 1.8 5.4 L7 10.8 2.9 14.2 l1.8-5.4 L0 5.4 h5.2 Z" />
      </svg>
      <div className="flex-1 max-w-24 h-px bg-current opacity-15" />
    </div>
  );
}

/** Converts a Google Maps share URL or address into an embed URL */
function buildMapsEmbedUrl(address: string, mapsUrl?: string | null): string {
  // If the URL is already an embed URL, use it directly
  if (mapsUrl?.includes("maps/embed")) return mapsUrl;
  // Fall back to address-based embed (always works)
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&hl=es`;
}

const EVENT_LABEL: Record<string, string> = {
  wedding: "♥  Nos casamos  ♥",
  xv: "✦  Mis XV Años  ✦",
  other: "✦  Te invitamos  ✦",
};

export function InvitationRenderer({ invitation }: InvitationRendererProps) {
  const theme = getThemeByKey(invitation.theme.theme_key);
  const mainDate = new Date(invitation.event.main_date);

  const bgUrl = resolveBackgroundUrl(invitation.theme.background_image_url, invitation.theme.default_background_key);
  const fontKey = (invitation.theme.typography as Record<string, string> | undefined)?.heading ?? "Playfair Display";
  const fontFamily = `'${fontKey}', Georgia, serif`;

  return (
    <main
      className={`min-h-screen ${bgUrl ? theme.textClassName : theme.className} relative`}
      style={bgUrl ? { backgroundImage: `url(${bgUrl})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={buildFontUrl(fontKey)} />

      {/* Tint overlay for readability when bg image is set */}
      {bgUrl ? <div className={`fixed inset-0 -z-10 ${theme.overlayClassName}`} aria-hidden /> : null}

      {/* ── Hero ───────────────────────────────────────── */}
      <header className="relative px-6 pt-16 pb-10 text-center overflow-hidden">
        <p className="text-xs tracking-[0.4em] uppercase opacity-40 mb-8 font-medium">
          {EVENT_LABEL[invitation.event.event_type] ?? EVENT_LABEL.other}
        </p>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-5"
          style={{ fontFamily: fontFamily }}
        >
          {theme.renderHeroTitle(invitation)}
        </h1>

        {invitation.event.honoree_names ? (
          <p className="text-base opacity-55 mb-8 tracking-wide">
            {invitation.event.honoree_names}
          </p>
        ) : null}

        {/* Date pill */}
        <div className="inline-flex items-center gap-5 bg-white/30 backdrop-blur-sm rounded-2xl px-8 py-5 mb-4 border border-white/40">
          <div className="text-center">
            <p
              className="text-5xl font-bold leading-none"
              style={{ fontFamily: fontFamily }}
            >
              {format(mainDate, "d", { locale: es })}
            </p>
            <p className="text-xs uppercase tracking-widest opacity-60 mt-1 capitalize">
              {format(mainDate, "MMMM", { locale: es })}
            </p>
            <p className="text-sm opacity-50 font-medium">{format(mainDate, "yyyy")}</p>
          </div>
          <div className="w-px h-14 bg-current opacity-15" />
          <div className="text-center">
            <p
              className="text-3xl font-bold leading-none"
              style={{ fontFamily: fontFamily }}
            >
              {format(mainDate, "HH:mm")}
            </p>
            <p className="text-xs uppercase tracking-widest opacity-60 mt-1">hrs</p>
          </div>
        </div>

        <div className="flex justify-center mt-4">
          <RsvpButtons invitation={invitation} ctaClassName={theme.ctaClassName} />
        </div>
      </header>

      {/* ── Gallery ─────────────────────────────────────── */}
      {invitation.gallery.length > 0 ? (
        <section className="px-4 sm:px-6 pb-2 max-w-4xl mx-auto">
          <div
            className={`grid gap-3 ${
              invitation.gallery.length === 1
                ? "grid-cols-1"
                : invitation.gallery.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-2 sm:grid-cols-3"
            }`}
          >
            {invitation.gallery.map((photo, i) => (
              <figure
                key={`${photo.image_url}-${photo.display_order}`}
                className={`overflow-hidden rounded-2xl bg-white/20 ${
                  i === 0 && invitation.gallery.length >= 3 ? "col-span-2" : ""
                }`}
              >
                <Image
                  src={photo.image_url}
                  alt={photo.caption ?? "Foto del evento"}
                  width={960}
                  height={640}
                  className={`w-full object-cover ${
                    i === 0 && invitation.gallery.length >= 3 ? "h-64 sm:h-80" : "h-52 sm:h-64"
                  }`}
                />
                {photo.caption ? (
                  <figcaption className="px-4 py-2 text-xs opacity-50 text-center">
                    {photo.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Countdown ───────────────────────────────────── */}
      <div className="max-w-2xl mx-auto px-6">
        <CountdownTimer targetDate={invitation.event.main_date} headingFont={fontKey} />
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <Ornament className="my-6" />
      </div>

      {/* ── Custom sections (mensaje) ────────────────────── */}
      {invitation.sections.length > 0 ? (
        <section className="px-6 pb-8 max-w-2xl mx-auto text-center space-y-8">
          {invitation.sections.map((section) => (
            <div key={section.section_key}>
              <h2
                className="text-2xl font-semibold mb-3"
                style={{ fontFamily: fontFamily }}
              >
                {section.heading}
              </h2>
              <p className="leading-relaxed opacity-65 text-base">{section.body}</p>
            </div>
          ))}
        </section>
      ) : null}

      {/* ── Schedule ────────────────────────────────────── */}
      {invitation.schedule.length > 0 ? (
        <section className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
          <article className="rounded-2xl bg-white/40 backdrop-blur-sm p-6">
            <h2
              className="text-xl font-semibold mb-5 text-center"
              style={{ fontFamily: fontFamily }}
            >
              Itinerario
            </h2>
            <div className="space-y-0">
              {invitation.schedule.map((item, i) => (
                <div key={`${item.title}-${item.display_order}`} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-current opacity-35 mt-1.5 shrink-0" />
                    {i < invitation.schedule.length - 1 ? (
                      <div className="w-px flex-1 min-h-4 bg-current opacity-10 my-1" />
                    ) : null}
                  </div>
                  <div className="pb-5">
                    <p className="font-semibold text-sm">{item.title}</p>
                    <p className="text-xs opacity-45 mt-0.5 capitalize">
                      {format(new Date(item.starts_at), "EEEE d MMM · HH:mm", { locale: es })}
                    </p>
                    {item.details ? (
                      <p className="text-sm opacity-60 mt-1 leading-relaxed">{item.details}</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>
      ) : null}

      {/* ── Locations + Maps ────────────────────────────── */}
      {invitation.locations.length > 0 ? (
        <section className="px-4 sm:px-6 pb-6 max-w-4xl mx-auto space-y-6">
          {invitation.locations.map((location) => (
            <article
              key={`${location.label}-${location.display_order}`}
              className="rounded-2xl bg-white/40 backdrop-blur-sm overflow-hidden"
            >
              {/* Details row */}
              <div className="p-6 pb-4">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">📍</span>
                      <h3
                        className="font-semibold text-lg"
                        style={{ fontFamily: fontFamily }}
                      >
                        {location.label}
                      </h3>
                    </div>
                    <p className="text-sm opacity-60 leading-relaxed pl-6">{location.address}</p>
                    {location.starts_at ? (
                      <p className="text-xs opacity-45 mt-1 pl-6 capitalize">
                        {format(new Date(location.starts_at), "EEEE d MMM · HH:mm", { locale: es })}
                      </p>
                    ) : null}
                  </div>
                  {location.maps_url ? (
                    <a
                      href={location.maps_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-medium border border-current opacity-50 hover:opacity-80 transition-opacity rounded-full px-3 py-1.5 self-start shrink-0"
                    >
                      Abrir en Maps ↗
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Embedded map */}
              <div className="relative h-52 sm:h-64 mx-4 mb-4 rounded-xl overflow-hidden">
                <iframe
                  src={buildMapsEmbedUrl(location.address, location.maps_url)}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Mapa: ${location.label}`}
                  className="absolute inset-0"
                />
              </div>
            </article>
          ))}
        </section>
      ) : null}

      {/* ── Footer CTA ──────────────────────────────────── */}
      <div className="px-6 pb-16 text-center">
        <div className="max-w-3xl mx-auto px-6">
          <Ornament className="my-8" />
        </div>
        <div className="flex justify-center mb-10">
          <RsvpButtons invitation={invitation} ctaClassName={theme.ctaClassName} />
        </div>
        <p className="text-xs opacity-25 tracking-[0.3em] uppercase">AvCenter Invitations</p>
      </div>
    </main>
  );
}
