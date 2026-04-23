export type PresetBackground = {
  key: string;
  name: string;
  url: string;
  /** Tailwind overlay class applied over the image for text readability */
  overlayClass: string;
};

export const PRESET_BACKGROUNDS: PresetBackground[] = [
  {
    key: "roses",
    name: "Rosas",
    url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&q=80",
    overlayClass: "bg-rose-950/20",
  },
  {
    key: "petals",
    name: "Pétalos",
    url: "https://images.unsplash.com/photo-1490750967868-88df5691cc6f?w=1600&q=80",
    overlayClass: "bg-pink-950/15",
  },
  {
    key: "forest",
    name: "Bosque",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&q=80",
    overlayClass: "bg-emerald-950/30",
  },
  {
    key: "tropical",
    name: "Tropical",
    url: "https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?w=1600&q=80",
    overlayClass: "bg-teal-950/30",
  },
  {
    key: "beach",
    name: "Playa",
    url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&q=80",
    overlayClass: "bg-sky-950/10",
  },
  {
    key: "marble",
    name: "Mármol",
    url: "https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1600&q=80",
    overlayClass: "bg-slate-950/10",
  },
];

export function getPresetBackground(key: string): PresetBackground | undefined {
  return PRESET_BACKGROUNDS.find((bg) => bg.key === key);
}

/** Returns the final background URL to render: custom upload takes priority over preset key */
export function resolveBackgroundUrl(
  backgroundImageUrl?: string | null,
  defaultBackgroundKey?: string | null
): string | null {
  if (backgroundImageUrl) return backgroundImageUrl;
  if (defaultBackgroundKey) {
    const preset = getPresetBackground(defaultBackgroundKey);
    return preset?.url ?? null;
  }
  return null;
}
