import { EventForm } from "@/features/admin/components/EventForm";
import { getDraftEventDefaults, getEventBundle, listEventGuests } from "@/features/admin/data/events";
import { requirePageUser } from "@/lib/auth/requireUser";

type AdminEventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEventDetailPage({ params }: AdminEventDetailPageProps) {
  const user = await requirePageUser();
  const { id } = await params;

  if (id === "new") {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-6 py-10">
        <h1 className="text-3xl font-bold">Nuevo evento</h1>
        <EventForm mode="create" initialValues={getDraftEventDefaults()} />
      </main>
    );
  }

  const [bundle, guests] = await Promise.all([
    getEventBundle(id, user.id),
    listEventGuests(id, user.id),
  ]);

  if (!bundle) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-4 px-6 py-10">
        <h1 className="text-3xl font-bold">Evento no encontrado</h1>
      </main>
    );
  }

  const confirmed = guests.filter((g) => g.confirmation_status === "confirmed");
  const totalAttendees = confirmed.reduce((sum, g) => sum + 1 + (g.plus_ones ?? 0), 0);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-6 py-10">
      <h1 className="text-3xl font-bold">Editar evento</h1>
      <EventForm mode="edit" eventId={id} initialValues={bundle} />

      {/* ── RSVP Guest List ─────────────────────────────── */}
      <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Confirmaciones recibidas</h2>
          {guests.length > 0 ? (
            <span className="rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-800 dark:bg-rose-900/40 dark:text-rose-300">
              {confirmed.length} confirmados · {totalAttendees} asistentes
            </span>
          ) : null}
        </div>

        {guests.length === 0 ? (
          <p className="text-sm text-zinc-500 dark:text-zinc-400">Aún no hay confirmaciones.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-200 dark:border-zinc-700 text-left text-xs uppercase tracking-wider text-zinc-400">
                  <th className="pb-2 pr-4">Nombre</th>
                  <th className="pb-2 pr-4">Teléfono</th>
                  <th className="pb-2 pr-4 text-center">+Acomp.</th>
                  <th className="pb-2 pr-4 text-center">Estado</th>
                  <th className="pb-2 text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {guests.map((guest) => (
                  <tr key={guest.id}>
                    <td className="py-2 pr-4 font-medium">{guest.guest_name}</td>
                    <td className="py-2 pr-4 text-zinc-500">{guest.guest_phone ?? "—"}</td>
                    <td className="py-2 pr-4 text-center">{guest.plus_ones}</td>
                    <td className="py-2 pr-4 text-center">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        guest.confirmation_status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
                          : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}>
                        {guest.confirmation_status === "confirmed" ? "Confirmado" : guest.confirmation_status}
                      </span>
                    </td>
                    <td className="py-2 text-right text-zinc-400 text-xs">
                      {new Date(guest.created_at as string).toLocaleDateString("es-MX", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
