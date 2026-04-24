import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { ScheduleConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: ScheduleConfig; ctx: RenderContext };

export function ScheduleBlock({ config, ctx }: Props) {
  const items = config.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 pb-6 max-w-2xl mx-auto">
      <article className="rounded-2xl bg-white/40 backdrop-blur-sm p-6">
        <h2
          className="text-xl font-semibold mb-5 text-center"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.title || "Itinerario"}
        </h2>
        <div className="space-y-0">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-2.5 h-2.5 rounded-full bg-current opacity-35 mt-1.5 shrink-0" />
                {i < items.length - 1 ? (
                  <div className="w-px flex-1 min-h-4 bg-current opacity-10 my-1" />
                ) : null}
              </div>
              <div className="pb-5">
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs opacity-45 mt-0.5 capitalize">
                  {format(new Date(item.starts_at), "EEEE d MMM · HH:mm", { locale: es })}
                </p>
                {item.details ? (
                  <p className="text-sm opacity-60 mt-1 leading-relaxed">{item.details}</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </article>
    </section>
  );
}
