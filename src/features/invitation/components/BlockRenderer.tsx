import type { PageBlock } from "@/features/invitation/types/blocks";
import type { EventRow, EventTheme, EventRsvpSettings } from "@/features/invitation/types";
import type { getThemeByKey } from "@/features/themes/registry";
import type { FullInvitation } from "@/features/invitation/types";

import { HeroBlock } from "./blocks/HeroBlock";
import { CountdownBlock } from "./blocks/CountdownBlock";
import { QuoteBlock } from "./blocks/QuoteBlock";
import { TextBlock } from "./blocks/TextBlock";
import { PhotoBlock } from "./blocks/PhotoBlock";
import { GalleryBlock } from "./blocks/GalleryBlock";
import { ScheduleBlock } from "./blocks/ScheduleBlock";
import { LocationBlock } from "./blocks/LocationBlock";
import { RsvpBlock } from "./blocks/RsvpBlock";
import { DividerBlock } from "./blocks/DividerBlock";
import { DressCodeBlock } from "./blocks/DressCodeBlock";
import { GiftRegistryBlock } from "./blocks/GiftRegistryBlock";
import { VideoBlock } from "./blocks/VideoBlock";
import { ContainerBlock } from "./blocks/ContainerBlock";
import { AnimatedWrapper } from "./AnimatedWrapper";

export type RenderContext = {
  event: EventRow;
  theme: EventTheme;
  themeObj: ReturnType<typeof getThemeByKey>;
  fontKey: string;
  fontFamily: string;
  rsvp: EventRsvpSettings;
  invitation: FullInvitation;
  /** CSS color for text override (cascades via color property) */
  textColor?: string;
  /** CSS color/rgba for card backgrounds */
  cardBg?: string;
};

type Props = {
  block: PageBlock;
  ctx: RenderContext;
};

export function BlockRenderer({ block, ctx }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfg = block.config as any;

  const content = (() => {
    switch (block.block_type) {
      case "hero":        return <HeroBlock config={cfg} ctx={ctx} />;
      case "countdown":   return <CountdownBlock config={cfg} ctx={ctx} />;
      case "quote":       return <QuoteBlock config={cfg} ctx={ctx} />;
      case "text":        return <TextBlock config={cfg} ctx={ctx} />;
      case "photo":       return <PhotoBlock config={cfg} />;
      case "gallery":     return <GalleryBlock config={cfg} />;
      case "schedule":    return <ScheduleBlock config={cfg} ctx={ctx} />;
      case "location":    return <LocationBlock config={cfg} ctx={ctx} />;
      case "rsvp":        return <RsvpBlock config={cfg} ctx={ctx} />;
      case "divider":     return <DividerBlock config={cfg} />;
      case "dress_code":  return <DressCodeBlock config={cfg} ctx={ctx} />;
      case "gift_registry": return <GiftRegistryBlock config={cfg} ctx={ctx} />;
      case "video":       return <VideoBlock config={cfg} />;
      case "grid":        return <ContainerBlock config={{ ...cfg, layout: "grid" }} ctx={ctx} />;
      case "flex":        return <ContainerBlock config={{ ...cfg, layout: "flex" }} ctx={ctx} />;
      default:            return null;
    }
  })();

  return (
    <AnimatedWrapper animation={block.animation}>
      {content}
    </AnimatedWrapper>
  );
}
