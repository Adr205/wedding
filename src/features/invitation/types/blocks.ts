export type BlockType =
  | "hero"
  | "countdown"
  | "quote"
  | "text"
  | "photo"
  | "gallery"
  | "schedule"
  | "location"
  | "rsvp"
  | "divider"
  | "dress_code"
  | "gift_registry";

// ── Per-block config shapes ─────────────────────────────────────────────────

export type HeroConfig = {
  show_date_pill?: boolean;
};

export type CountdownConfig = {
  style?: "numbers" | "minimal";
  label?: string;
};

export type QuoteConfig = {
  text: string;
  author?: string;
};

export type TextConfig = {
  heading: string;
  body: string;
  alignment?: "left" | "center" | "right";
};

export type PhotoConfig = {
  image_url: string;
  caption?: string;
  display?: "full-width" | "contained";
  height?: "sm" | "md" | "lg";
};

export type GalleryImage = {
  image_url: string;
  caption?: string | null;
};

export type GalleryConfig = {
  images: GalleryImage[];
  layout?: "grid" | "carousel";
  columns?: 1 | 2 | 3 | 4;
};

export type ScheduleItem = {
  title: string;
  starts_at: string;
  ends_at?: string | null;
  details?: string | null;
};

export type ScheduleConfig = {
  title?: string;
  items: ScheduleItem[];
};

export type LocationConfig = {
  label: string;
  address: string;
  maps_url?: string | null;
  starts_at?: string | null;
  show_map?: boolean;
};

export type RsvpConfig = {
  title?: string;
  subtitle?: string;
};

export type DividerConfig = {
  style?: "ornament" | "line" | "dots";
};

export type DressCodeConfig = {
  title?: string;
  description: string;
  colors?: string[];
};

export type GiftItem = {
  name: string;
  url: string;
};

export type GiftRegistryConfig = {
  title?: string;
  items: GiftItem[];
};

// ── PageBlock ───────────────────────────────────────────────────────────────

export type PageBlock = {
  id?: string;
  block_type: BlockType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config: Record<string, any>;
  display_order: number;
  enabled: boolean;
};

// ── UI labels for admin ─────────────────────────────────────────────────────

export const BLOCK_LABELS: Record<BlockType, string> = {
  hero: "Hero (encabezado)",
  countdown: "Cuenta regresiva",
  quote: "Frase / Cita",
  text: "Sección de texto",
  photo: "Foto única",
  gallery: "Galería de fotos",
  schedule: "Itinerario",
  location: "Ubicación",
  rsvp: "Confirmación (RSVP)",
  divider: "Separador",
  dress_code: "Código de vestimenta",
  gift_registry: "Mesa de regalos",
};

export const ADDABLE_BLOCK_TYPES: BlockType[] = [
  "text",
  "quote",
  "photo",
  "gallery",
  "schedule",
  "location",
  "countdown",
  "divider",
  "dress_code",
  "gift_registry",
  "rsvp",
];
