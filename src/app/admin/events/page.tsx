import Link from "next/link";
import { listEvents } from "@/features/admin/data/events";
import { requirePageUser } from "@/lib/auth/requireUser";

export default async function AdminEventsPage() {
  const user = await requirePageUser();
  const events = await listEvents(user.id);

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-6 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold dark:text-zinc-100">Eventos</h1>
          <p className="text-zinc-600 dark:text-zinc-300">Gestiona todas las invitaciones creadas.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/events/new" className="rounded-xl bg-zinc-900 px-4 py-2 font-semibold text-white hover:bg-zinc-700">
            Nuevo evento
          </Link>
          <form action="/api/auth/logout" method="post">
            <button className="rounded-xl border border-zinc-300 px-4 py-2 font-semibold hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
              Salir
            </button>
          </form>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-100 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t border-zinc-100 dark:border-zinc-700">
                <td className="px-4 py-3">{event.title}</td>
                <td className="px-4 py-3">{event.slug}</td>
                <td className="px-4 py-3">{event.event_type}</td>
                <td className="px-4 py-3">{event.is_published ? "Publicado" : "Borrador"}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/events/${event.id}`} className="underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-zinc-500 dark:text-zinc-400">
                  Aún no tienes eventos creados.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </main>
  );
}
