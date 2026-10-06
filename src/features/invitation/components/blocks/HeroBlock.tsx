import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { HeroConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

const EVENT_LABEL: Record<string, string> = {
  wedding: "Nos casamos",
  xv: "Mis XV Años",
  other: "Te invitamos",
};

type Props = { config: HeroConfig; ctx: RenderContext };

export function HeroBlock({ config, ctx }: Props) {
  const { event, themeObj, fontFamily } = ctx;
  const mainDate = new Date(event.main_date);
  const showDatePill = config.show_date_pill !== false;

  return (
    <header className="relative px-6 pt-20 pb-14 text-center overflow-hidden">
      <div className="mx-auto mb-10 flex max-w-sm items-center gap-4 opacity-35">
        <span className="h-px flex-1 bg-current" />
        <p className="text-[0.65rem] tracking-[0.45em] uppercase font-normal shrink-0">
          {EVENT_LABEL[event.event_type] ?? EVENT_LABEL.other}
        </p>
        <span className="h-px flex-1 bg-current" />
      </div>

      <h1
        className="text-[2.75rem] sm:text-6xl md:text-7xl font-normal leading-[1.15] tracking-wide mb-6"
        style={{ fontFamily }}
      >
        {themeObj.renderHeroTitle(ctx.invitation)}
      </h1>

      {event.honoree_names ? (
        <p className="text-sm opacity-50 mb-10 tracking-[0.2em] uppercase font-light">
          {event.honoree_names}
        </p>
      ) : (
        <div className="mb-10" />
      )}

      {showDatePill ? (
        <div className="inline-flex flex-col items-center gap-3">
          <div className="flex items-end justify-center gap-4">
            <p
              className="text-5xl sm:text-6xl font-bold leading-none tracking-wide"
              style={{ fontFamily }}
            >
              {format(mainDate, "d", { locale: es })}
            </p>
            <div className="pb-1.5 text-left">
              <p className="text-xs uppercase tracking-[0.35em] opacity-55 capitalize font-semibold">
                {format(mainDate, "MMMM", { locale: es })}
              </p>
              <p className="text-sm opacity-40 tracking-widest mt-0.5 font-semibold">
                {format(mainDate, "yyyy")}
              </p>
            </div>
          </div>
          <span className="h-px w-10 bg-current opacity-20" />
          <p className="text-xs tracking-[0.4em] uppercase opacity-45 font-semibold">
            {format(mainDate, "HH:mm")} hrs
          </p>
        </div>
      ) : null}
    </header>
  );
}
