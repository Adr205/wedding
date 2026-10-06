import {
  DEFAULT_GIFT_ENVELOPES_MESSAGE,
  type GiftEnvelopesConfig,
} from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: GiftEnvelopesConfig; ctx: RenderContext };

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 56"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="4" y="8" width="72" height="44" rx="3" />
      <path d="M4 14 L40 36 L76 14" />
      <path d="M4 52 L30 30" opacity="0.35" />
      <path d="M76 52 L50 30" opacity="0.35" />
    </svg>
  );
}

export function GiftEnvelopesBlock({ config, ctx }: Props) {
  const message = (config.message ?? DEFAULT_GIFT_ENVELOPES_MESSAGE).trim();

  return (
    <section className="px-4 sm:px-6 py-6 max-w-2xl mx-auto text-center">
      <div
        className="rounded-2xl backdrop-blur-sm p-6 sm:p-8"
        style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}
      >
        <div className="mx-auto mb-6 flex max-w-xs items-center gap-4 opacity-30">
          <span className="h-px flex-1 bg-current" />
          <p className="text-[0.65rem] tracking-[0.4em] uppercase shrink-0">Regalos</p>
          <span className="h-px flex-1 bg-current" />
        </div>

        <h3
          className="text-2xl sm:text-3xl font-normal tracking-wide mb-5"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.title || "Mesa de regalos"}
        </h3>

        <div className="mx-auto mb-6 flex justify-center opacity-40">
          <EnvelopeIcon className="h-12 w-[4.5rem] sm:h-14 sm:w-20" />
        </div>

        {message ? (
          <p className="text-sm opacity-55 leading-relaxed max-w-sm mx-auto whitespace-pre-line">
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
