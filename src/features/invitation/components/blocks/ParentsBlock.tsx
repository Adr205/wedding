import type { ParentsConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: ParentsConfig; ctx: RenderContext };

function namesOf(first?: string, second?: string) {
  return [first, second].map((n) => n?.trim()).filter(Boolean) as string[];
}

export function ParentsBlock({ config, ctx }: Props) {
  const brideNames = namesOf(config.bride_parent_1, config.bride_parent_2);
  const groomNames = namesOf(config.groom_parent_1, config.groom_parent_2);
  if (brideNames.length === 0 && groomNames.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 py-6 max-w-2xl mx-auto text-center">
      <div
        className="rounded-2xl backdrop-blur-sm p-6 sm:p-8"
        style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}
      >
        <div className="mx-auto mb-6 flex max-w-xs items-center gap-4 opacity-30">
          <span className="h-px flex-1 bg-current" />
          <p className="text-[0.65rem] tracking-[0.4em] uppercase shrink-0">Familia</p>
          <span className="h-px flex-1 bg-current" />
        </div>

        <h3
          className="text-2xl sm:text-3xl font-normal tracking-wide mb-10"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.title || "Con la bendición de"}
        </h3>

        <div className={brideNames.length > 0 && groomNames.length > 0 ? "grid gap-10 sm:grid-cols-2 sm:gap-8" : "max-w-xs mx-auto"}>
          {brideNames.length > 0 ? (
            <div>
              <p className="text-[0.65rem] tracking-[0.3em] uppercase opacity-40 mb-3">
                {config.bride_label || "Padres de la novia"}
              </p>
              {brideNames.map((name, i) => (
                <p
                  key={`bride-${i}`}
                  className="text-lg sm:text-xl font-normal tracking-wide leading-relaxed"
                  style={{ fontFamily: ctx.fontFamily }}
                >
                  {name}
                </p>
              ))}
            </div>
          ) : null}

          {groomNames.length > 0 ? (
            <div>
              <p className="text-[0.65rem] tracking-[0.3em] uppercase opacity-40 mb-3">
                {config.groom_label || "Padres del novio"}
              </p>
              {groomNames.map((name, i) => (
                <p
                  key={`groom-${i}`}
                  className="text-lg sm:text-xl font-normal tracking-wide leading-relaxed"
                  style={{ fontFamily: ctx.fontFamily }}
                >
                  {name}
                </p>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
