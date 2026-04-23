import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getThemeByKey } from "@/features/themes/registry";
import type { FullInvitation } from "@/features/invitation/types";
import { RsvpButtons } from "@/features/invitation/components/RsvpButtons";

type InvitationRendererProps = {
  invitation: FullInvitation;
};

function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 my-8 ${className}`}>
      <div className="flex-1 max-w-24 h-px bg-current opacity-15" />
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="currentColor"
        className="opacity-30 shrink-0"
      >
        <path d="M7 0 l1.8 5.4 H14 l-4.7 3.4 1.8 5.4 L7 10.8 2.9 14.2 l1.8-5.4 L0 5.4 h5.2 Z" />
      </svg>
      <div className="flex-1 max-w-24 h-px bg-current opacity-15" />
    </div>
  );
}

const EVENT_LABEL: Record<string, string> = {
  wedding: "♥  Nos casamos  ♥",
  xv: "✦  Mis XV Años  ✦",
  other: "✦  Te invitamos  ✦",
};

export function InvitationRenderer({ invitation }: InvitationRendererProps) {
  const theme = getThemeByKey(invitation.theme.theme_key);
  const mainDate = new Date(invitation.event.main_date);

  return (
    <main className={`min-h-screen ${theme.className}`}>
      {/* Hero */}
      <header className="relative px-6 pt-16 pb-14 text-center overflow-hidden">
        <p className="text-xs tracking-[0.4em] uppercase opacity-40 mb-8 font-medium">
          {EVENT_LABEL[invitation.event.event_type] ?? EVENT_LABEL.other}
        </p>

        <h1
          className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-5"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {theme.renderHeroTitle(invitation)}
        </h1>

        {invitation.event.honoree_names ? (
          <p className="text-base opacity-55 mb-8 tracking-wide">{invitation.event.honoree_names}</p>
        ) : null}

        {/* Date block */}
        <div className="inline-flex items-center gap-5 bg-white/30 backdrop-blur-sm rounded-2xl px-8 py-5 mb-10 border border-white/40">
          <div className="text-center">
            <p
              className="text-5xl font-bold leading-none"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
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
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {format(mainDate, "HH:mm")}
            </p>
            <p className="text-xs uppercase tracking-widest opacity-60 mt-1">hrs</p>
          </div>
        </div>

        <div className="flex justify-center">
          <RsvpButtons invitation={invitation} ctaClassName={theme.ctaClassName} />
        </div>
      </header>

      {/* Gallery */}
      {invitation.gallery.length > 0 ? (
        <section className="px-4 sm:px-6 pb-4 max-w-4xl mx-auto">
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
                  i === 0 && invitation.gallery.length >= 3 ? "col-span-2 sm:col-span-2" : ""
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

      <Ornament />

      {/* Custom sections */}
      {invitation.sections.length > 0 ? (
        <section className="px-6 pb-4 max-w-2xl mx-auto text-center space-y-8">
          {invitation.sections.map((section) => (
            <div key={section.section_key}>
              <h2
                className="text-2xl font-semibold mb-3"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {section.heading}
              </h2>
              <p className="leading-relaxed opacity-65 text-base">{section.body}</p>
            </div>
          ))}
        </section>
      ) : null}

      {/* Schedule + Locations */}
      {(invitation.schedule.length > 0 || invitation.locations.length > 0) ? (
        <section className="px-4 sm:px-6 py-4 max-w-4xl mx-auto">
          <div className="grid gap-4 md:grid-cols-2">
            {invitation.schedule.length > 0 ? (
              <article className="rounded-2xl bg-white/40 backdrop-blur-sm p-6">
                <h2
                  className="text-xl font-semibold mb-5"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Itinerario
                </h2>
                <div className="space-y-0">
                  {invitation.schedule.map((item, i) => (
                    <div
                      key={`${item.title}-${item.display_order}`}
                      className="flex gap-4"
                    >
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
            ) : null}

            {invitation.locations.length > 0 ? (
              <article className="rounded-2xl bg-white/40 backdrop-blur-sm p-6">
                <h2
                  className="text-xl font-semibold mb-5"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  Ubicaciones
                </h2>
                <div className="space-y-5">
                  {invitation.locations.map((location) => (
                    <div key={`${location.label}-${location.display_order}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm">📍</span>
                        <p className="font-semibold text-sm">{location.label}</p>
                      </div>
                      <p className="text-xs opacity-55 pl-6 leading-relaxed">{location.address}</p>
                      {location.maps_url ? (
                        <a
                          href={location.maps_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs pl-6 underline underline-offset-2 opacity-45 hover:opacity-70 transition-opacity inline-block mt-0.5"
                        >
                          Ver en Google Maps →
                        </a>
                      ) : null}
                    </div>
                  ))}
                </div>
              </article>
            ) : null}
          </div>
        </section>
      ) : null}

      {/* Footer CTA */}
      <div className="px-6 pb-16 text-center">
        <Ornament />
        <div className="flex justify-center mb-10">
          <RsvpButtons invitation={invitation} ctaClassName={theme.ctaClassName} />
        </div>
        <p className="text-xs opacity-25 tracking-[0.3em] uppercase">AvCenter Invitations</p>
      </div>
    </main>
  );
}
