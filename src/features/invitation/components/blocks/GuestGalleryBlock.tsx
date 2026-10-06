import type { GuestGalleryConfig } from "@/features/invitation/types/blocks";
import type { RenderContext } from "@/features/invitation/components/BlockRenderer";
import { GuestGalleryUploader } from "@/features/guestgallery/GuestGalleryUploader";

type Props = { config: GuestGalleryConfig; ctx: RenderContext };

export function GuestGalleryBlock({ config, ctx }: Props) {
  const uploads = ctx.invitation.uploads ?? [];

  return (
    <section className="px-4 sm:px-6 py-6 max-w-2xl mx-auto text-center">
      <div
        className="rounded-2xl backdrop-blur-sm p-6 sm:p-8"
        style={{ background: "var(--inv-card, rgba(255,255,255,0.4))" }}
      >
        <div className="mx-auto mb-6 flex max-w-xs items-center gap-4 opacity-30">
          <span className="h-px flex-1 bg-current" />
          <p className="text-[0.65rem] tracking-[0.4em] uppercase shrink-0">Fotos</p>
          <span className="h-px flex-1 bg-current" />
        </div>

        <h2
          className="text-2xl sm:text-3xl font-normal tracking-wide mb-2"
          style={{ fontFamily: ctx.fontFamily }}
        >
          {config.title || "Comparte tus fotos"}
        </h2>
        <p className="text-sm opacity-55 mb-8 max-w-sm mx-auto">
          {config.subtitle || "Sube las fotos que tomaste para que todos las revivan."}
        </p>

        <GuestGalleryUploader slug={ctx.event.slug} ctaClassName={ctx.themeObj.ctaClassName} />

        {uploads.length > 0 ? (
          <div className="mt-8 columns-2 sm:columns-3 gap-3 [&>*]:mb-3 text-left">
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
      </div>
    </section>
  );
}
