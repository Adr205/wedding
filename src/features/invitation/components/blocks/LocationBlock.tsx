import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { LocationConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

function buildMapsLink(address: string, mapsUrl?: string | null): string {
  if (mapsUrl) return mapsUrl;
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&hl=es`;
}

function buildMapsEmbedUrl(address: string, mapsUrl?: string | null): string {
  if (mapsUrl?.includes("maps/embed")) return mapsUrl;
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&hl=es`;
}

type Props = { config: LocationConfig; ctx: RenderContext };

export function LocationBlock({ config, ctx }: Props) {
  if (!config.label && !config.address) return null;

  const showMap = config.show_map === true;
  const mapsHref =
    config.address || config.maps_url
      ? buildMapsLink(config.address || config.label, config.maps_url)
      : null;

  return (
    <section className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto text-center">
      <div
        className="rounded-2xl backdrop-blur-sm p-6 sm:p-8"
        style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}
      >
        <div className="mx-auto mb-6 flex max-w-xs items-center gap-4 opacity-30">
          <span className="h-px flex-1 bg-current" />
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current shrink-0" aria-hidden>
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
          </svg>
          <span className="h-px flex-1 bg-current" />
        </div>

        {config.label ? (
          <h3
            className="text-2xl sm:text-3xl font-normal tracking-wide mb-3"
            style={{ fontFamily: ctx.fontFamily }}
          >
            {config.label}
          </h3>
        ) : null}

        {config.address ? (
          <p className="text-sm opacity-55 leading-relaxed max-w-sm mx-auto">
            {config.address}
          </p>
        ) : null}

        {config.starts_at ? (
          <p className="text-xs opacity-40 mt-2 tracking-[0.2em] uppercase">
            {format(new Date(config.starts_at), "EEEE d MMM · HH:mm", { locale: es })}
          </p>
        ) : null}

        {mapsHref ? (
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            className="group mt-7 inline-flex flex-col items-center gap-2 transition-opacity hover:opacity-70"
          >
            <span className="text-lg tracking-wide" style={{ fontFamily: ctx.fontFamily }}>
              Ver ubicación
            </span>
            <span className="flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] opacity-45">
              <span className="h-px w-6 bg-current transition-all group-hover:w-8" />
              Abrir en Maps
              <span className="h-px w-6 bg-current transition-all group-hover:w-8" />
            </span>
          </a>
        ) : null}

        {showMap && config.address ? (
          <div className="relative mt-8 h-48 sm:h-56 rounded-xl overflow-hidden opacity-90">
            <iframe
              src={buildMapsEmbedUrl(config.address, config.maps_url)}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Mapa: ${config.label}`}
              className="absolute inset-0"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
