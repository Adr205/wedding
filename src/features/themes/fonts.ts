export type WeddingFont = {
  key: string;
  name: string;
  category: "script" | "serif" | "sans";
  /** Google Fonts CSS2 family string (already URL-safe) */
  googleFamily: string;
  /** Text displayed in the preview */
  previewText: string;
};

export const WEDDING_FONTS: WeddingFont[] = [
  {
    key: "Playfair Display",
    name: "Playfair Display",
    category: "serif",
    googleFamily: "Playfair+Display:ital,wght@0,700;1,400",
    previewText: "Sofía & Alejandro",
  },
  {
    key: "Great Vibes",
    name: "Great Vibes",
    category: "script",
    googleFamily: "Great+Vibes",
    previewText: "Sofía & Alejandro",
  },
  {
    key: "Cormorant Garamond",
    name: "Cormorant Garamond",
    category: "serif",
    googleFamily: "Cormorant+Garamond:ital,wght@0,600;1,400",
    previewText: "Sofía & Alejandro",
  },
  {
    key: "Dancing Script",
    name: "Dancing Script",
    category: "script",
    googleFamily: "Dancing+Script:wght@700",
    previewText: "Sofía & Alejandro",
  },
  {
    key: "Cinzel",
    name: "Cinzel",
    category: "serif",
    googleFamily: "Cinzel:wght@700",
    previewText: "SOFÍA & ALEJANDRO",
  },
  {
    key: "Lora",
    name: "Lora",
    category: "serif",
    googleFamily: "Lora:ital,wght@0,700;1,400",
    previewText: "Sofía & Alejandro",
  },
  {
    key: "Sacramento",
    name: "Sacramento",
    category: "script",
    googleFamily: "Sacramento",
    previewText: "Sofía & Alejandro",
  },
  {
    key: "Josefin Sans",
    name: "Josefin Sans",
    category: "sans",
    googleFamily: "Josefin+Sans:wght@300;600",
    previewText: "SOFÍA & ALEJANDRO",
  },
];

export const DEFAULT_FONT_KEY = "Playfair Display";

/** Builds a single Google Fonts stylesheet URL that loads all wedding fonts */
export function buildAllFontsUrl(): string {
  const families = WEDDING_FONTS.map((f) => `family=${f.googleFamily}`).join("&");
  return `https://fonts.googleapis.com/css2?${families}&display=swap`;
}

/** Builds a Google Fonts stylesheet URL for a single font family */
export function buildFontUrl(fontKey: string): string {
  const font = WEDDING_FONTS.find((f) => f.key === fontKey);
  const family = font?.googleFamily ?? WEDDING_FONTS[0]!.googleFamily;
  return `https://fonts.googleapis.com/css2?family=${family}&display=swap`;
}
