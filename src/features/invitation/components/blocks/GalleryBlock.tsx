import Image from "next/image";
import type { GalleryConfig } from "@/features/invitation/types/blocks";
import { GalleryCarousel } from "./GalleryCarousel";

type Props = { config: GalleryConfig };

export function GalleryBlock({ config }: Props) {
  const images = config.images ?? [];
  if (images.length === 0) return null;

  if (config.layout === "carousel") {
    return (
      <section className="px-4 sm:px-6 pb-2 max-w-4xl mx-auto">
        <GalleryCarousel images={images} />
      </section>
    );
  }

  // Grid layout
  const cols = config.columns ?? 3;
  const gridClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 2
        ? "grid-cols-2"
        : images.length <= 2
          ? "grid-cols-2"
          : "grid-cols-2 sm:grid-cols-3";

  return (
    <section className="px-4 sm:px-6 pb-2 max-w-4xl mx-auto">
      <div className={`grid gap-3 ${gridClass}`}>
        {images.map((photo, i) => (
          <figure
            key={i}
            className={`overflow-hidden rounded-2xl bg-white/20 ${
              i === 0 && images.length >= 3 ? "col-span-2" : ""
            }`}
          >
            <Image
              src={photo.image_url}
              alt={photo.caption ?? "Foto del evento"}
              width={960}
              height={640}
              className={`w-full object-cover ${
                i === 0 && images.length >= 3 ? "h-64 sm:h-80" : "h-52 sm:h-64"
              }`}
            />
            {photo.caption ? (
              <figcaption className="px-4 py-2 text-xs opacity-50 text-center">
                {photo.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
    </section>
  );
}
