import { RSVPForm } from "@/features/rsvp/RSVPForm";
import type { RsvpConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: RsvpConfig; ctx: RenderContext };

export function RsvpBlock({ config, ctx }: Props) {
  return (
    <section className="px-6 pb-10 max-w-sm mx-auto text-center">
      <p
        className="text-2xl font-semibold mb-2"
        style={{ fontFamily: ctx.fontFamily }}
      >
        {config.title || "¿Confirmas tu asistencia?"}
      </p>
      <p className="text-sm opacity-50 mb-6">
        {config.subtitle || "Tu lugar es importante para nosotros."}
      </p>
      <RSVPForm
        slug={ctx.event.slug}
        ctaClassName={ctx.themeObj.ctaClassName}
        headingFont={ctx.fontKey}
      />
    </section>
  );
}
