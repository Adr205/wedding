export function buildWhatsappLink({
  whatsappNumber,
  messageTemplate,
  guestName,
  eventTitle,
}: {
  whatsappNumber: string;
  messageTemplate: string;
  guestName?: string;
  eventTitle: string;
}) {
  const text = messageTemplate
    .replace("{{guestName}}", guestName ?? "Invitado")
    .replace("{{eventTitle}}", eventTitle);

  const normalizedNumber = whatsappNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(text)}`;
}
