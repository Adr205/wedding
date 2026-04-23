import { buildGoogleCalendarLink } from "@/features/calendar/buildCalendarLinks";
import { buildWhatsappLink } from "@/features/rsvp/whatsapp";
import type { FullInvitation } from "@/features/invitation/types";

type RsvpButtonsProps = {
  invitation: FullInvitation;
  ctaClassName: string;
};

export function RsvpButtons({ invitation, ctaClassName }: RsvpButtonsProps) {
  const mainLocation = invitation.locations[0];
  const whatsappLink = buildWhatsappLink({
    whatsappNumber: invitation.rsvp.whatsapp_number,
    messageTemplate: invitation.rsvp.message_template,
    eventTitle: invitation.event.title,
  });

  const calendarLink = buildGoogleCalendarLink({
    title: invitation.event.title,
    startIso: invitation.event.main_date,
    details: `Invitación a ${invitation.event.title}`,
    location: mainLocation?.address,
  });

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {invitation.rsvp.enabled ? (
        <a className={`rounded-xl px-4 py-3 font-semibold ${ctaClassName}`} href={whatsappLink} target="_blank" rel="noreferrer">
          Confirmar asistencia por WhatsApp
        </a>
      ) : null}
      <a
        className="rounded-xl border border-current px-4 py-3 font-semibold hover:bg-black/5"
        href={calendarLink}
        target="_blank"
        rel="noreferrer"
      >
        Agendar en Google Calendar
      </a>
    </div>
  );
}
