import type { VideoConfig } from "@/features/invitation/types/blocks";

function buildEmbedUrl(url: string): string | null {
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;

  // Vimeo
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;

  // Already an embed URL
  if (url.includes("/embed/") || url.includes("player.vimeo")) return url;

  return null;
}

const ASPECT: Record<string, string> = {
  "16:9": "aspect-video",
  "4:3": "aspect-4/3",
  "1:1": "aspect-square",
};

type Props = { config: VideoConfig };

export function VideoBlock({ config }: Props) {
  if (!config.url) return null;
  const embedUrl = buildEmbedUrl(config.url);
  if (!embedUrl) return null;

  const aspectClass = ASPECT[config.aspect ?? "16:9"] ?? "aspect-video";

  return (
    <section className="px-4 sm:px-6 pb-4 max-w-4xl mx-auto">
      {config.title ? (
        <p className="text-xs tracking-[0.3em] uppercase opacity-40 mb-3 text-center">
          {config.title}
        </p>
      ) : null}
      <div className={`relative w-full overflow-hidden rounded-2xl ${aspectClass}`}>
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          title={config.title ?? "Video"}
        />
      </div>
    </section>
  );
}
