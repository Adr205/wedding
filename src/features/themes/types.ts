import type { FullInvitation } from "@/features/invitation/types";

export type ThemeDefinition = {
  key: string;
  name: string;
  /** Full className including bg and text colors — used when no background image is set */
  className: string;
  /** Only the text color class — used when a background image is active */
  textClassName: string;
  ctaClassName: string;
  /** Subtle tint overlay applied over background images for readability */
  overlayClassName: string;
  renderHeroTitle: (invitation: FullInvitation) => string;
};
