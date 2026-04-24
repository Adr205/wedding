import type { PageBlock } from "@/features/invitation/types/blocks";

export type EventType = "wedding" | "xv" | "other";

export type EventRow = {
  id: string;
  slug: string;
  event_type: EventType;
  title: string;
  honoree_names: string;
  main_date: string;
  timezone: string;
  is_published: boolean;
};

export type EventTheme = {
  theme_key: string;
  palette?: Record<string, string>;
  /** typography.heading stores the selected Google Font key, e.g. "Great Vibes" */
  typography?: Record<string, string>;
  block_config?: Record<string, boolean>;
  background_image_url?: string | null;
  default_background_key?: string | null;
};

export type EventRsvpSettings = {
  whatsapp_number: string;
  message_template: string;
  enabled: boolean;
};

export type FullInvitation = {
  event: EventRow;
  theme: EventTheme;
  blocks: PageBlock[];
  rsvp: EventRsvpSettings;
};

// Legacy types kept for migration layer compatibility
export type EventSection = {
  section_key: string;
  heading: string;
  body: string;
  display_order: number;
};

export type EventGalleryItem = {
  image_url: string;
  caption?: string | null;
  display_order: number;
};

export type EventScheduleItem = {
  title: string;
  starts_at: string;
  ends_at?: string | null;
  details?: string | null;
  display_order: number;
};

export type EventLocation = {
  label: string;
  address: string;
  maps_url?: string | null;
  starts_at?: string | null;
  display_order: number;
};
