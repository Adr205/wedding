import Image from "next/image";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getThemeByKey } from "@/features/themes/registry";
import type { FullInvitation } from "@/features/invitation/types";
import { RsvpButtons } from "@/features/invitation/components/RsvpButtons";

type InvitationRendererProps = {
  invitation: FullInvitation;
};

export function InvitationRenderer({ invitation }: InvitationRendererProps) {
  const theme = getThemeByKey(invitation.theme.theme_key);

  return (
    <main className={`min-h-screen ${theme.className}`}>
      <section className="mx-auto max-w-4xl space-y-8 px-6 py-14">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.2em]">Invitación digital</p>
          <h1 className="text-4xl font-bold">{theme.renderHeroTitle(invitation)}</h1>
          <p className="text-lg">{invitation.event.honoree_names}</p>
          <p className="text-base">
            {format(new Date(invitation.event.main_date), "PPPPp", { locale: es })}
          </p>
          <div className="pt-2">
            <RsvpButtons invitation={invitation} ctaClassName={theme.ctaClassName} />
          </div>
        </header>

        {invitation.gallery.length > 0 ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {invitation.gallery.map((photo) => (
              <figure key={`${photo.image_url}-${photo.display_order}`} className="overflow-hidden rounded-2xl bg-white/70">
                <Image src={photo.image_url} alt={photo.caption ?? "Foto del evento"} width={960} height={640} className="h-72 w-full object-cover" />
                {photo.caption ? <figcaption className="p-3 text-sm">{photo.caption}</figcaption> : null}
              </figure>
            ))}
          </section>
        ) : null}

        <section className="grid gap-6 md:grid-cols-2">
          <article className="space-y-3 rounded-2xl bg-white/60 p-5">
            <h2 className="text-2xl font-semibold">Itinerario</h2>
            {invitation.schedule.length === 0 ? <p>Aún no hay eventos cargados.</p> : null}
            {invitation.schedule.map((item) => (
              <div key={`${item.title}-${item.display_order}`} className="space-y-1">
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm">{format(new Date(item.starts_at), "PPpp", { locale: es })}</p>
                {item.details ? <p className="text-sm">{item.details}</p> : null}
              </div>
            ))}
          </article>

          <article className="space-y-3 rounded-2xl bg-white/60 p-5">
            <h2 className="text-2xl font-semibold">Ubicaciones</h2>
            {invitation.locations.length === 0 ? <p>Aún no hay ubicaciones cargadas.</p> : null}
            {invitation.locations.map((location) => (
              <div key={`${location.label}-${location.display_order}`} className="space-y-1">
                <p className="font-semibold">{location.label}</p>
                <p className="text-sm">{location.address}</p>
                {location.maps_url ? (
                  <a href={location.maps_url} target="_blank" rel="noreferrer" className="text-sm underline">
                    Abrir en mapa
                  </a>
                ) : null}
              </div>
            ))}
          </article>
        </section>

        <section className="space-y-4 rounded-2xl bg-white/60 p-5">
          <h2 className="text-2xl font-semibold">Mensaje</h2>
          {invitation.sections.length === 0 ? <p>Próximamente más información del evento.</p> : null}
          {invitation.sections.map((section) => (
            <div key={section.section_key} className="space-y-1">
              <h3 className="text-lg font-semibold">{section.heading}</h3>
              <p>{section.body}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
