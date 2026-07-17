import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { SubeventsConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";
import { buildGoogleCalendarLink } from "@/features/calendar/buildCalendarLinks";

type Props = { config: SubeventsConfig; ctx: RenderContext };

export function SubeventsBlock({ config, ctx }: Props) {
  const items = (config.items ?? []).filter((it) => it.name || it.starts_at);
  if (items.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
      {config.title ? (
        <h2
          className="text-xl font-semibold mb-4 text-center"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.title}
        </h2>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((item, i) => {
          const details = [item.location_label, item.address].filter(Boolean).join(" · ");
          return (
            <article
              key={i}
              className="flex flex-col rounded-2xl backdrop-blur-sm p-5"
              style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}
            >
              <div className="flex items-center gap-2 mb-2">
                {item.emoji ? <span className="text-2xl leading-none">{item.emoji}</span> : null}
                <h3 className="font-semibold text-lg" style={{ fontFamily: ctx.fontFamily }}>
                  {item.name}
                </h3>
              </div>

              {item.starts_at ? (
                <p className="text-sm opacity-60 capitalize">
                  {format(new Date(item.starts_at), "EEEE d 'de' MMMM · HH:mm", { locale: es })}
                  {" hrs"}
                </p>
              ) : null}

              {item.location_label ? (
                <p className="text-sm opacity-70 mt-2 font-medium">{item.location_label}</p>
              ) : null}
              {item.address ? (
                <p className="text-xs opacity-50 mt-0.5 leading-relaxed">{item.address}</p>
              ) : null}

              {item.dress_code ? (
                <p className="text-xs opacity-60 mt-2">
                  <span className="opacity-60">Vestimenta:</span> {item.dress_code}
                </p>
              ) : null}

              <div className="mt-auto flex flex-wrap gap-2 pt-4">
                {item.starts_at ? (
                  <a
                    href={buildGoogleCalendarLink({
                      title: item.name,
                      startIso: item.starts_at,
                      endIso: item.ends_at ?? undefined,
                      details: item.dress_code ? `Vestimenta: ${item.dress_code}` : undefined,
                      location: details || undefined,
                    })}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium border border-current opacity-50 hover:opacity-80 transition-opacity rounded-full px-3 py-1.5"
                  >
                    Agendar
                  </a>
                ) : null}
                {item.maps_url || item.address ? (
                  <a
                    href={item.maps_url || `https://maps.google.com/maps?q=${encodeURIComponent(item.address ?? "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium border border-current opacity-50 hover:opacity-80 transition-opacity rounded-full px-3 py-1.5"
                  >
                    Cómo llegar ↗
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
