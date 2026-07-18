import type { GuestbookConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";
import { GuestbookForm } from "@/features/guestbook/GuestbookForm";

type Props = { config: GuestbookConfig; ctx: RenderContext };

export function GuestbookBlock({ config, ctx }: Props) {
  const messages = ctx.invitation.messages ?? [];

  return (
    <section className="px-4 sm:px-6 pb-8 max-w-2xl mx-auto">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: ctx.fontFamily }}>
          {config.title || "Libro de mensajes"}
        </h2>
        <p className="text-sm opacity-50">
          {config.subtitle || "Déjanos unas palabras para recordar este día."}
        </p>
      </div>

      <GuestbookForm slug={ctx.event.slug} ctaClassName={ctx.themeObj.ctaClassName} />

      {messages.length > 0 ? (
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {messages.map((m) => (
            <article
              key={m.id}
              className="rounded-2xl backdrop-blur-sm p-4"
              style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}
            >
              <p className="text-sm leading-relaxed opacity-80 italic">“{m.body}”</p>
              <p className="mt-2 text-xs font-semibold opacity-60">— {m.author_name}</p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
