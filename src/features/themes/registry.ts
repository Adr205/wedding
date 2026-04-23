import type { ThemeDefinition } from "@/features/themes/types";

const defaultTheme: ThemeDefinition = {
  key: "elegant",
  name: "Elegant",
  className: "bg-rose-50 text-stone-800",
  ctaClassName: "bg-rose-700 text-white hover:bg-rose-800",
  renderHeroTitle: (invitation) => invitation.event.title,
};

const themes: ThemeDefinition[] = [
  defaultTheme,
  {
    key: "floral",
    name: "Floral",
    className: "bg-fuchsia-50 text-fuchsia-950",
    ctaClassName: "bg-fuchsia-700 text-white hover:bg-fuchsia-800",
    renderHeroTitle: (invitation) => `Celebramos: ${invitation.event.title}`,
  },
];

export function getThemeByKey(themeKey?: string) {
  return themes.find((theme) => theme.key === themeKey) ?? defaultTheme;
}

export const availableThemes = themes;
