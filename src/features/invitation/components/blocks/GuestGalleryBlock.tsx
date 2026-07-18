import type { GuestGalleryConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";
import { GuestGalleryUploader } from "@/features/guestgallery/GuestGalleryUploader";

type Props = { config: GuestGalleryConfig; ctx: RenderContext };

export function GuestGalleryBlock({ config, ctx }: Props) {
  const uploads = ctx.invitation.uploads ?? [];

  return (
    <section className="px-4 sm:px-6 pb-8 max-w-3xl mx-auto">
      <div className="text-center mb-5">
        <h2 className="text-2xl font-semibold mb-1" style={{ fontFamily: ctx.fontFamily }}>
          {config.title || "Comparte tus fotos"}
        </h2>
        <p className="text-sm opacity-50">
          {config.subtitle || "Sube las fotos que tomaste para que todos las revivan."}
        </p>
      </div>

      <GuestGalleryUploader slug={ctx.event.slug} ctaClassName={ctx.themeObj.ctaClassName} />

      {uploads.length > 0 ? (
        <div className="mt-8 columns-2 sm:columns-3 gap-3 [&>*]:mb-3">
          {uploads.map((u) => (
            <figure key={u.id} className="overflow-hidden rounded-xl break-inside-avoid">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={u.image_url}
                alt={u.uploader_name ? `Foto de ${u.uploader_name}` : "Foto de invitado"}
                loading="lazy"
                className="w-full h-auto object-cover"
              />
              {u.uploader_name ? (
                <figcaption className="px-1 pt-1 text-xs opacity-45">{u.uploader_name}</figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : null}
    </section>
  );
}
