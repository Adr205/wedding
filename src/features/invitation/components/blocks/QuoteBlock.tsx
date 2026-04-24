import type { QuoteConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: QuoteConfig; ctx: RenderContext };

export function QuoteBlock({ config, ctx }: Props) {
  if (!config.text) return null;
  return (
    <section className="px-6 py-8 max-w-2xl mx-auto text-center">
      <blockquote>
        <p
          className="text-2xl sm:text-3xl font-medium leading-relaxed italic opacity-75"
          style={{ fontFamily: ctx.fontFamily }}
        >
          &ldquo;{config.text}&rdquo;
        </p>
        {config.author ? (
          <footer className="mt-4 text-sm opacity-40 tracking-widest uppercase">
            — {config.author}
          </footer>
        ) : null}
      </blockquote>
    </section>
  );
}
