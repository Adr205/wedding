import { getThemeByKey } from "@/features/themes/registry";
import type { FullInvitation } from "@/features/invitation/types";
import { resolveBackgroundUrl } from "@/features/themes/backgrounds";
import { buildFontUrl } from "@/features/themes/fonts";
import { buildGoogleCalendarLink } from "@/features/calendar/buildCalendarLinks";
import { BlockRenderer, type RenderContext } from "@/features/invitation/components/BlockRenderer";
import { DividerBlock } from "@/features/invitation/components/blocks/DividerBlock";

type InvitationRendererProps = {
  invitation: FullInvitation;
};

export function InvitationRenderer({ invitation }: InvitationRendererProps) {
  const theme = getThemeByKey(invitation.theme.theme_key);
  const bgUrl = resolveBackgroundUrl(
    invitation.theme.background_image_url,
    invitation.theme.default_background_key,
  );
  const fontKey =
    (invitation.theme.typography as Record<string, string> | undefined)?.heading ??
    "Playfair Display";
  const fontFamily = `'${fontKey}', Georgia, serif`;

  // Palette color overrides
  const palette = invitation.theme.palette as Record<string, string> | undefined;
  const textColor = palette?.text || undefined;
  const cardBg = palette?.card_bg || undefined;

  const ctx: RenderContext = {
    event: invitation.event,
    theme: invitation.theme,
    themeObj: theme,
    fontKey,
    fontFamily,
    rsvp: invitation.rsvp,
    invitation,
    textColor,
    cardBg,
  };

  const visibleBlocks = [...invitation.blocks]
    .filter((b) => b.enabled)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <main
      className={`min-h-screen ${bgUrl ? theme.textClassName : theme.className} relative`}
      style={
        {
          ...(bgUrl
            ? {
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
              }
            : {}),
          ...(textColor ? { color: textColor } : {}),
          "--inv-card": cardBg || "rgba(255,255,255,0.4)",
        } as React.CSSProperties
      }
    >
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="stylesheet" href={buildFontUrl(fontKey)} />

      {bgUrl ? (
        <div className={`fixed inset-0 -z-10 ${theme.overlayClassName}`} aria-hidden />
      ) : null}

      {visibleBlocks.map((block) => (
        <BlockRenderer
          key={block.id ?? `${block.block_type}-${block.display_order}`}
          block={block}
          ctx={ctx}
        />
      ))}

      {/* ── Footer — always shown ───────────────────────── */}
      <div className="px-6 pb-16 text-center">
        <DividerBlock config={{ style: "ornament" }} />
        <a
          href={buildGoogleCalendarLink({
            title: invitation.event.title,
            startIso: invitation.event.main_date,
            details: `Invitación a ${invitation.event.title}`,
            location: undefined,
          })}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full border border-current px-6 py-3 text-sm font-semibold opacity-60 hover:opacity-80 transition-opacity mb-10"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Agendar en calendario
        </a>
        <p className="text-xs opacity-25 tracking-[0.3em] uppercase block">
          AvCenter Invitations
        </p>
      </div>
    </main>
  );
}
