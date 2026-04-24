import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { HeroConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

const EVENT_LABEL: Record<string, string> = {
  wedding: "♥  Nos casamos  ♥",
  xv: "✦  Mis XV Años  ✦",
  other: "✦  Te invitamos  ✦",
};

type Props = { config: HeroConfig; ctx: RenderContext };

export function HeroBlock({ config, ctx }: Props) {
  const { event, themeObj, fontFamily } = ctx;
  const mainDate = new Date(event.main_date);
  const showDatePill = config.show_date_pill !== false;

  return (
    <header className="relative px-6 pt-16 pb-10 text-center overflow-hidden">
      <p className="text-xs tracking-[0.4em] uppercase opacity-40 mb-8 font-medium">
        {EVENT_LABEL[event.event_type] ?? EVENT_LABEL.other}
      </p>

      <h1
        className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight mb-5"
        style={{ fontFamily }}
      >
        {themeObj.renderHeroTitle(ctx.invitation)}
      </h1>

      {event.honoree_names ? (
        <p className="text-base opacity-55 mb-8 tracking-wide">{event.honoree_names}</p>
      ) : null}

      {showDatePill ? (
        <div className="inline-flex items-center gap-5 bg-white/30 backdrop-blur-sm rounded-2xl px-8 py-5 mb-4 border border-white/40">
          <div className="text-center">
            <p className="text-5xl font-bold leading-none" style={{ fontFamily }}>
              {format(mainDate, "d", { locale: es })}
            </p>
            <p className="text-xs uppercase tracking-widest opacity-60 mt-1 capitalize">
              {format(mainDate, "MMMM", { locale: es })}
            </p>
            <p className="text-sm opacity-50 font-medium">{format(mainDate, "yyyy")}</p>
          </div>
          <div className="w-px h-14 bg-current opacity-15" />
          <div className="text-center">
            <p className="text-3xl font-bold leading-none" style={{ fontFamily }}>
              {format(mainDate, "HH:mm")}
            </p>
            <p className="text-xs uppercase tracking-widest opacity-60 mt-1">hrs</p>
          </div>
        </div>
      ) : null}
    </header>
  );
}
