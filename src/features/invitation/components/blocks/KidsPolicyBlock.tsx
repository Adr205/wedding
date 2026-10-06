import type { KidsPolicyConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: KidsPolicyConfig; ctx: RenderContext };

const DEFAULT_ALLOWED =
  "Los niños son bienvenidos a celebrar con nosotros.";
const DEFAULT_NOT_ALLOWED =
  "Con mucho cariño, les pedimos que esta celebración sea solo para adultos.";

export function KidsPolicyBlock({ config, ctx }: Props) {
  const allowed = config.allowed !== false;
  const message = (config.message || (allowed ? DEFAULT_ALLOWED : DEFAULT_NOT_ALLOWED)).trim();

  return (
    <section className="px-4 sm:px-6 py-6 max-w-2xl mx-auto text-center">
      <div
        className="rounded-2xl backdrop-blur-sm p-6 sm:p-8"
        style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}
      >
        <div className="mx-auto mb-6 flex max-w-xs items-center gap-4 opacity-30">
          <span className="h-px flex-1 bg-current" />
          <p className="text-[0.65rem] tracking-[0.4em] uppercase shrink-0">Invitados</p>
          <span className="h-px flex-1 bg-current" />
        </div>

        <h3
          className="text-2xl sm:text-3xl font-normal tracking-wide mb-3"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.title || (allowed ? "Los niños son bienvenidos" : "Evento solo para adultos")}
        </h3>

        <p className="text-sm opacity-55 leading-relaxed max-w-sm mx-auto whitespace-pre-line">
          {message}
        </p>
      </div>
    </section>
  );
}
