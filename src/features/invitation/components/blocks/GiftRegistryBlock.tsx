import type { GiftRegistryConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: GiftRegistryConfig; ctx: RenderContext };

export function GiftRegistryBlock({ config, ctx }: Props) {
  const items = config.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="px-6 py-6 max-w-2xl mx-auto text-center">
      <div className="rounded-2xl backdrop-blur-sm p-6" style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}>
        <p className="text-xs tracking-[0.3em] uppercase opacity-40 mb-2">
          {config.title || "Mesa de regalos"}
        </p>
        <h2
          className="text-xl font-semibold mb-5"
          style={{ fontFamily: ctx.fontFamily }}
        >
          🎁 Con gusto aceptamos tu regalo
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {items.map((item, i) => (
            <a
              key={i}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-current px-5 py-2.5 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >
              {item.name} ↗
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
