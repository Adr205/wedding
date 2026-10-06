import { format } from "date-fns";
import type { ScheduleConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: ScheduleConfig; ctx: RenderContext };

function ChurchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M40 6v10" />
      <path d="M34 11h12" />
      <path d="M28 22h24v10H28z" />
      <path d="M32 22V16h16v6" />
      <path d="M22 32h36v38H22z" />
      <path d="M14 42h8v28h-8zM58 42h8v28h-8z" />
      <path d="M36 70V52h8v18" />
      <circle cx="40" cy="42" r="3" />
      <path d="M40 36v-2" />
    </svg>
  );
}

function RingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="32" cy="46" r="16" />
      <circle cx="48" cy="46" r="16" />
      <path d="M48 30l3-7 3 3.5 4-5 2 6.5" />
      <path d="M51 23l3 3.5" />
    </svg>
  );
}

function ChampagneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 12c1 14 5 22 12 25v28M34 65H22" />
      <path d="M22 12h16s-1 14-8 18c-7-4-8-18-8-18z" />
      <path d="M42 20c1 14 5 22 12 25v28M54 73H42" />
      <path d="M42 20h16s-1 14-8 18c-7-4-8-18-8-18z" />
      <circle cx="58" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="64" cy="18" r="1.2" fill="currentColor" stroke="none" />
      <circle cx="56" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const ICONS = [ChurchIcon, RingsIcon, ChampagneIcon] as const;

function HeartMarker() {
  return (
    <span className="relative z-[1] flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current bg-[var(--inv-card,rgba(255,255,255,0.92))]">
      <svg viewBox="0 0 24 24" className="h-3 w-3 fill-current opacity-80" aria-hidden>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </span>
  );
}

export function ScheduleBlock({ config, ctx }: Props) {
  const items = config.items ?? [];
  if (items.length === 0) return null;

  return (
    <section className="px-4 sm:px-6 pb-8 max-w-lg mx-auto">
      <h2
        className="text-2xl sm:text-3xl font-normal text-center mb-10 tracking-wide"
        style={{ fontFamily: ctx.fontFamily }}
      >
        {config.title || "Itinerario"}
      </h2>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-1/2 top-3.5 bottom-3.5 w-px -translate-x-1/2 bg-current opacity-30"
          aria-hidden
        />

        <ol className="relative space-y-10 sm:space-y-14">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length]!;
            const iconOnLeft = i % 2 === 0;
            const timeLabel = `${format(new Date(item.starts_at), "HH:mm")} hrs`;

            const textBlock = (
              <div className={iconOnLeft ? "text-left" : "text-right"}>
                <p className="text-base sm:text-lg leading-snug" style={{ fontFamily: ctx.fontFamily }}>
                  {timeLabel}
                </p>
                <p className="text-base sm:text-lg leading-snug mt-0.5" style={{ fontFamily: ctx.fontFamily }}>
                  {item.title}
                </p>
                {item.details ? (
                  <p className="text-xs opacity-50 mt-1 leading-relaxed">{item.details}</p>
                ) : null}
              </div>
            );

            const iconBlock = (
              <Icon className="h-12 w-12 sm:h-[3.75rem] sm:w-[3.75rem] opacity-75" />
            );

            return (
              <li key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
                <div className="flex justify-end">{iconOnLeft ? iconBlock : textBlock}</div>
                <HeartMarker />
                <div className="flex justify-start">{iconOnLeft ? textBlock : iconBlock}</div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
