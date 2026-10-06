import type { HotelsConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: HotelsConfig; ctx: RenderContext };

export function HotelsBlock({ config, ctx }: Props) {
  const items = (config.items ?? []).filter((item) => item.name || item.address);
  if (items.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto text-center">
      <div
        className="rounded-2xl backdrop-blur-sm p-6 sm:p-8"
        style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}
      >
        <div className="mx-auto mb-6 flex max-w-xs items-center gap-4 opacity-30">
          <span className="h-px flex-1 bg-current" />
          <p className="text-[0.65rem] tracking-[0.4em] uppercase shrink-0">Hospedaje</p>
          <span className="h-px flex-1 bg-current" />
        </div>

        <h3
          className="text-2xl sm:text-3xl font-normal tracking-wide mb-8"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.title || "Hoteles"}
        </h3>

        <div className="space-y-8">
          {items.map((item, i) => (
            <article key={i} className={i > 0 ? "pt-8 border-t border-current/10" : ""}>
              {item.name ? (
                <h4
                  className="text-xl sm:text-2xl font-normal tracking-wide mb-2"
                  style={{ fontFamily: ctx.fontFamily }}
                >
                  {item.name}
                </h4>
              ) : null}

              {item.address ? (
                <p className="text-sm opacity-55 leading-relaxed max-w-sm mx-auto">
                  {item.address}
                </p>
              ) : null}

              {item.discount_code ? (
                <p className="mt-4 text-[0.65rem] tracking-[0.25em] uppercase opacity-50">
                  Código de descuento
                  <span className="mt-1 block text-sm tracking-[0.2em] opacity-90">
                    {item.discount_code}
                  </span>
                </p>
              ) : null}

              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group mt-5 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.35em] opacity-45 transition-opacity hover:opacity-70"
                >
                  <span className="h-px w-6 bg-current transition-all group-hover:w-8" />
                  Ver ubicación
                  <span className="h-px w-6 bg-current transition-all group-hover:w-8" />
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
