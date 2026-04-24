"use client";

import { useState } from "react";
import Image from "next/image";
import type { GalleryImage } from "@/features/invitation/types/blocks";

type Props = { images: GalleryImage[] };

export function GalleryCarousel({ images }: Props) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) return null;

  const prev = () => setCurrent((i) => (i - 1 + images.length) % images.length);
  const next = () => setCurrent((i) => (i + 1) % images.length);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white/20">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((photo, i) => (
          <figure key={i} className="relative w-full shrink-0 h-64 sm:h-96">
            <Image
              src={photo.image_url}
              alt={photo.caption ?? "Foto"}
              fill
              className="object-cover"
            />
            {photo.caption ? (
              <figcaption className="absolute bottom-0 left-0 right-0 bg-black/40 px-4 py-2 text-xs text-white text-center">
                {photo.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>

      {images.length > 1 ? (
        <>
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
            aria-label="Anterior"
          >
            ‹
          </button>
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-colors"
            aria-label="Siguiente"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? "bg-white w-3" : "bg-white/50"}`}
                aria-label={`Foto ${i + 1}`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
