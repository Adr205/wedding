import type { ContainerConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";

// Lazy import to avoid circular dep at module init time
// BlockRenderer is imported inline inside the render function
const GAP: Record<string, string> = {
  sm: "gap-2",
  md: "gap-4",
  lg: "gap-8",
};

const GRID_COLS: Record<number, string> = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
};

const ALIGN: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  stretch: "items-stretch",
};

const JUSTIFY_FLEX: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

const JUSTIFY_GRID: Record<string, string> = {
  start: "justify-items-start",
  center: "justify-items-center",
  end: "justify-items-end",
  between: "justify-items-stretch",
};

type Props = { config: ContainerConfig; ctx: RenderContext };

export function ContainerBlock({ config, ctx }: Props) {
  const children = (config.children ?? []).filter((b) => b.enabled);
  if (children.length === 0) return null;

  const gap = GAP[config.gap ?? "md"] ?? "gap-4";
  const align = ALIGN[config.align ?? "start"] ?? "items-start";

  const title = config.title?.trim();

  if (config.layout === "flex") {
    const justify = JUSTIFY_FLEX[config.justify ?? "center"] ?? "justify-center";
    return (
      <section className="px-4 sm:px-6 pb-4 max-w-5xl mx-auto">
        {title ? (
          <p className="text-xs tracking-[0.3em] uppercase opacity-40 mb-4 text-center">{title}</p>
        ) : null}
        <div className={`flex flex-wrap ${gap} ${align} ${justify}`}>
          <ChildBlocks children={children} ctx={ctx} />
        </div>
      </section>
    );
  }

  // Grid (default)
  const cols = GRID_COLS[config.columns ?? 2] ?? "grid-cols-1 sm:grid-cols-2";
  const justifyItems = JUSTIFY_GRID[config.justify ?? "start"] ?? "justify-items-start";
  return (
    <section className="px-4 sm:px-6 pb-4 max-w-5xl mx-auto">
      {title ? (
        <p className="text-xs tracking-[0.3em] uppercase opacity-40 mb-4 text-center">{title}</p>
      ) : null}
      <div className={`grid ${cols} ${gap} ${align} ${justifyItems}`}>
        <ChildBlocks children={children} ctx={ctx} />
      </div>
    </section>
  );
}

function ChildBlocks({ children, ctx }: { children: ContainerConfig["children"]; ctx: RenderContext }) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { BlockRenderer } = require("@/features/invitation/components/BlockRenderer") as typeof import("@/features/invitation/components/BlockRenderer");
  return (
    <>
      {children.map((block, i) => (
        <div key={block.id ?? i} className="min-w-0">
          <BlockRenderer block={block} ctx={ctx} />
        </div>
      ))}
    </>
  );
}
