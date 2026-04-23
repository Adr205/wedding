import type { ThemeDefinition } from "@/features/themes/types";

const themes: ThemeDefinition[] = [
  {
    key: "elegant",
    name: "Elegante (Rosa)",
    className: "bg-rose-50 text-stone-800",
    textClassName: "text-stone-100",
    ctaClassName: "bg-rose-700 text-white hover:bg-rose-800",
    overlayClassName: "bg-rose-950/20",
    renderHeroTitle: (invitation) => invitation.event.title,
  },
  {
    key: "floral",
    name: "Floral (Fucsia)",
    className: "bg-fuchsia-50 text-fuchsia-950",
    textClassName: "text-fuchsia-50",
    ctaClassName: "bg-fuchsia-700 text-white hover:bg-fuchsia-800",
    overlayClassName: "bg-fuchsia-950/25",
    renderHeroTitle: (invitation) => invitation.event.title,
  },
  {
    key: "golden",
    name: "Dorado (Ámbar)",
    className: "bg-amber-50 text-amber-950",
    textClassName: "text-amber-50",
    ctaClassName: "bg-amber-700 text-white hover:bg-amber-800",
    overlayClassName: "bg-amber-950/25",
    renderHeroTitle: (invitation) => invitation.event.title,
  },
  {
    key: "modern",
    name: "Moderno (Oscuro)",
    className: "bg-zinc-900 text-zinc-100",
    textClassName: "text-zinc-100",
    ctaClassName: "bg-white text-zinc-900 hover:bg-zinc-100",
    overlayClassName: "bg-zinc-950/50",
    renderHeroTitle: (invitation) => invitation.event.title,
  },
];

const defaultTheme = themes[0]!;

export function getThemeByKey(themeKey?: string) {
  return themes.find((theme) => theme.key === themeKey) ?? defaultTheme;
}

export const availableThemes = themes;
