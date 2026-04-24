import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { LocationConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

function buildMapsEmbedUrl(address: string, mapsUrl?: string | null): string {
  if (mapsUrl?.includes("maps/embed")) return mapsUrl;
  return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&hl=es`;
}

type Props = { config: LocationConfig; ctx: RenderContext };

export function LocationBlock({ config, ctx }: Props) {
  if (!config.label && !config.address) return null;
  const showMap = config.show_map !== false;

  return (
    <section className="px-4 sm:px-6 pb-6 max-w-4xl mx-auto">
      <article className="rounded-2xl backdrop-blur-sm overflow-hidden" style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}>
        <div className="p-6 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base">📍</span>
                <h3
                  className="font-semibold text-lg"
                  style={{ fontFamily: ctx.fontFamily }}
                >
                  {config.label}
                </h3>
              </div>
              <p className="text-sm opacity-60 leading-relaxed pl-6">{config.address}</p>
              {config.starts_at ? (
                <p className="text-xs opacity-45 mt-1 pl-6 capitalize">
                  {format(new Date(config.starts_at), "EEEE d MMM · HH:mm", { locale: es })}
                </p>
              ) : null}
            </div>
            {config.maps_url ? (
              <a
                href={config.maps_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium border border-current opacity-50 hover:opacity-80 transition-opacity rounded-full px-3 py-1.5 self-start shrink-0"
              >
                Abrir en Maps ↗
              </a>
            ) : null}
          </div>
        </div>
        {showMap && config.address ? (
          <div className="relative h-52 sm:h-64 mx-4 mb-4 rounded-xl overflow-hidden">
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
      </article>
    </section>
  );
}
