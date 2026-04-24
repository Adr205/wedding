import type { TextConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: TextConfig; ctx: RenderContext };

export function TextBlock({ config, ctx }: Props) {
  const align = config.alignment ?? "center";
  const alignClass = align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center";

  return (
    <section className={`px-6 py-6 max-w-2xl mx-auto ${alignClass}`}>
      {config.heading ? (
        <h2
          className="text-2xl font-semibold mb-3"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.heading}
        </h2>
      ) : null}
      {config.body ? (
        <p className="leading-relaxed opacity-65 text-base whitespace-pre-line">{config.body}</p>
      ) : null}
    </section>
  );
}
