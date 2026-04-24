import Image from "next/image";
import type { PhotoConfig } from "@/features/invitation/types/blocks";

type Props = { config: PhotoConfig };

const HEIGHT_CLASS: Record<string, string> = {
  sm: "h-48 sm:h-56",
  md: "h-64 sm:h-80",
  lg: "h-80 sm:h-[28rem]",
};

export function PhotoBlock({ config }: Props) {
  if (!config.image_url) return null;
  const display = config.display ?? "full-width";
  const heightClass = HEIGHT_CLASS[config.height ?? "md"];

  return (
    <section className={`py-2 ${display === "contained" ? "px-4 sm:px-6 max-w-3xl mx-auto" : ""}`}>
      <figure className={`overflow-hidden bg-white/20 ${display === "contained" ? "rounded-2xl" : ""}`}>
        <div className={`relative w-full ${heightClass}`}>
          <Image
            src={config.image_url}
            alt={config.caption ?? "Foto"}
            fill
            className="object-cover"
          />
        </div>
        {config.caption ? (
          <figcaption className="px-4 py-2 text-xs opacity-50 text-center">
            {config.caption}
          </figcaption>
        ) : null}
      </figure>
    </section>
  );
}
