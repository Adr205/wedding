import { CountdownTimer } from "@/features/invitation/components/CountdownTimer";
import type { CountdownConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

type Props = { config: CountdownConfig; ctx: RenderContext };

export function CountdownBlock({ config: _config, ctx }: Props) {
  return (
    <div className="max-w-2xl mx-auto px-6">
      <CountdownTimer targetDate={ctx.event.main_date} headingFont={ctx.fontKey} />
    </div>
  );
}
