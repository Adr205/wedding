import type { FullInvitation } from "@/features/invitation/types";

export type ThemeDefinition = {
  key: string;
  name: string;
  className: string;
  ctaClassName: string;
  renderHeroTitle: (invitation: FullInvitation) => string;
};
