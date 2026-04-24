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

const JUSTIFY: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

type Props = { config: ContainerConfig; ctx: RenderContext };

export function ContainerBlock({ config, ctx }: Props) {
  const children = (config.children ?? []).filter((b) => b.enabled);
  if (children.length === 0) return null;

  const gap = GAP[config.gap ?? "md"] ?? "gap-4";

  if (config.layout === "flex") {
    const align = ALIGN[config.align ?? "center"] ?? "items-center";
    const justify = JUSTIFY[config.justify ?? "center"] ?? "justify-center";
    return (
      <section className={`px-4 sm:px-6 pb-4 max-w-5xl mx-auto flex flex-wrap ${gap} ${align} ${justify}`}>
        <ChildBlocks children={children} ctx={ctx} />
      </section>
    );
  }

  // Grid (default)
  const cols = GRID_COLS[config.columns ?? 2] ?? "grid-cols-1 sm:grid-cols-2";
  return (
    <section className={`px-4 sm:px-6 pb-4 max-w-5xl mx-auto grid ${cols} ${gap}`}>
      <ChildBlocks children={children} ctx={ctx} />
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
