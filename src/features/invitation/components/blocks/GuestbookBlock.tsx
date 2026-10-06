import type { GuestbookConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";
import { GuestbookForm } from "@/features/guestbook/GuestbookForm";

type Props = { config: GuestbookConfig; ctx: RenderContext };

export function GuestbookBlock({ config, ctx }: Props) {
  const messages = ctx.invitation.messages ?? [];

  return (
    <section className="px-4 sm:px-6 py-6 max-w-2xl mx-auto text-center">
      <div
        className="rounded-2xl backdrop-blur-sm p-6 sm:p-8"
        style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}
      >
        <div className="mx-auto mb-6 flex max-w-xs items-center gap-4 opacity-30">
          <span className="h-px flex-1 bg-current" />
          <p className="text-[0.65rem] tracking-[0.4em] uppercase shrink-0">Mensajes</p>
          <span className="h-px flex-1 bg-current" />
        </div>

        <h2
          className="text-2xl sm:text-3xl font-normal tracking-wide mb-2"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.title || "Libro de mensajes"}
        </h2>
        <p className="text-sm opacity-55 mb-8 max-w-sm mx-auto">
          {config.subtitle || "Déjanos unas palabras para recordar este día."}
        </p>

        <GuestbookForm slug={ctx.event.slug} ctaClassName={ctx.themeObj.ctaClassName} />

        {messages.length > 0 ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 text-left">
            {messages.map((m) => (
              <article
                key={m.id}
                className="rounded-xl border border-current/10 bg-black/5 p-4"
              >
                <p className="text-sm leading-relaxed opacity-80 italic">“{m.body}”</p>
                <p className="mt-2 text-xs font-semibold opacity-60">— {m.author_name}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
