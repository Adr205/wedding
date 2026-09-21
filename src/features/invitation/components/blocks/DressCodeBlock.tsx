import type { DressCodeConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: DressCodeConfig; ctx: RenderContext };

function DressIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="32" cy="10" r="6" />
      <path d="M26 16c0 4 2.5 7 6 7s6-3 6-7" />
      <path d="M22 28l10-5 10 5" />
      <path d="M22 28c-4 6-8 18-10 36h40c-2-18-6-30-10-36" />
      <path d="M32 23v41" opacity="0.35" />
      <path d="M12 64h40" opacity="0.25" />
    </svg>
  );
}

function SuitIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 96"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="32" cy="10" r="6" />
      <path d="M20 28l12-7 12 7" />
      <path d="M20 28v48h24V28" />
      <path d="M32 21v28" />
      <path d="M32 49l-8 27M32 49l8 27" />
      <path d="M28 21c0 4 1.5 7 4 7s4-3 4-7" />
      <path d="M20 28l-6 8M44 28l6 8" />
      <path d="M30 55h4" />
    </svg>
  );
}

export function DressCodeBlock({ config, ctx }: Props) {
  if (!config.description) return null;
  const colors = config.colors ?? [];

  return (
    <section className="px-6 py-6 max-w-2xl mx-auto text-center">
      <div
        className="rounded-2xl backdrop-blur-sm p-6 sm:p-8"
        style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}
      >
        <div className="mx-auto mb-8 flex max-w-xs items-center gap-4 opacity-30">
          <span className="h-px flex-1 bg-current" />
          <p className="text-[0.65rem] tracking-[0.4em] uppercase shrink-0">Vestimenta</p>
          <span className="h-px flex-1 bg-current" />
        </div>

        <div className="flex items-end justify-center gap-8 sm:gap-12 mb-8 opacity-75">
          <div className="flex flex-col items-center gap-2">
            <DressIcon className="h-20 w-14 sm:h-24 sm:w-16" />
            <span className="text-[0.65rem] tracking-[0.25em] uppercase opacity-50">Damas</span>
          </div>
          <span className="h-16 w-px bg-current opacity-15 mb-6" aria-hidden />
          <div className="flex flex-col items-center gap-2">
            <SuitIcon className="h-20 w-14 sm:h-24 sm:w-16" />
            <span className="text-[0.65rem] tracking-[0.25em] uppercase opacity-50">Caballeros</span>
          </div>
        </div>

        <h3
          className="text-2xl sm:text-3xl font-normal tracking-wide mb-3"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.title || "Código de vestimenta"}
        </h3>

        <p
          className="text-xl sm:text-2xl font-normal tracking-wide mb-4"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.description}
        </p>

        <p className="text-sm opacity-55 leading-relaxed max-w-sm mx-auto">
          Te pedimos respetar el código indicado para acompañar la ocasión con elegancia.
          Elige un atuendo acorde al estilo de la celebración.
        </p>

        {colors.length > 0 ? (
          <div className="mt-8">
            <p className="text-[0.65rem] tracking-[0.35em] uppercase opacity-40 mb-4">
              Tonos a evitar
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {colors.map((color, i) => (
                <span
                  key={i}
                  className="w-8 h-8 rounded-full border border-current/15 shadow-sm inline-block"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
