import type { DressCodeConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: DressCodeConfig; ctx: RenderContext };

export function DressCodeBlock({ config, ctx }: Props) {
  if (!config.description) return null;
  const colors = config.colors ?? [];

  return (
    <section className="px-6 py-6 max-w-2xl mx-auto text-center">
      <div className="rounded-2xl backdrop-blur-sm p-6" style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}>
        <p className="text-xs tracking-[0.3em] uppercase opacity-40 mb-3">
          {config.title || "Código de vestimenta"}
        </p>
        <p
          className="text-xl font-medium mb-4"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.description}
        </p>
        {colors.length > 0 ? (
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {colors.map((color, i) => (
              <span
                key={i}
                className="w-7 h-7 rounded-full border border-black/10 shadow-sm inline-block"
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
