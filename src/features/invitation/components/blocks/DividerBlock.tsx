import type { DividerConfig } from "@/features/invitation/types/blocks";

type Props = { config: DividerConfig };

function OrnamentSVG() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" className="opacity-25 shrink-0">
      <path d="M7 0 l1.8 5.4 H14 l-4.7 3.4 1.8 5.4 L7 10.8 2.9 14.2 l1.8-5.4 L0 5.4 h5.2 Z" />
    </svg>
  );
}

export function DividerBlock({ config }: Props) {
  const style = config.style ?? "ornament";

  if (style === "line") {
    return (
      <div className="max-w-3xl mx-auto px-6 my-6">
        <div className="h-px bg-current opacity-15" />
      </div>
    );
  }

  if (style === "dots") {
    return (
      <div className="max-w-3xl mx-auto px-6 my-6 flex items-center justify-center gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1.5 h-1.5 rounded-full bg-current opacity-25" />
        ))}
      </div>
    );
  }

  // Ornament (default)
  return (
    <div className="max-w-3xl mx-auto px-6 my-6">
      <div className="flex items-center justify-center gap-4">
        <div className="flex-1 max-w-24 h-px bg-current opacity-15" />
        <OrnamentSVG />
        <div className="flex-1 max-w-24 h-px bg-current opacity-15" />
      </div>
    </div>
  );
}
