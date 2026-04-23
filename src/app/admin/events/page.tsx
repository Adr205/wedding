import Link from "next/link";
import { listEvents } from "@/features/admin/data/events";
import { requirePageUser } from "@/lib/auth/requireUser";

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "Boda",
  xv: "XV Años",
  other: "Evento",
};

export default async function AdminEventsPage() {
  const user = await requirePageUser();
  const events = await listEvents(user.id);

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-200 px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-rose-400">✦</span>
            <span className="font-semibold tracking-wide text-stone-800">AvCenter</span>
            <span className="text-xs text-stone-400 tracking-[0.2em] uppercase">Admin</span>
          </div>
          <form action="/api/auth/logout" method="post">
            <button className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              Cerrar sesión
            </button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl font-bold text-stone-900"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Tus invitaciones
            </h1>
            <p className="text-stone-500 text-sm mt-0.5">
              {events.length} evento{events.length !== 1 ? "s" : ""} creado{events.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-1.5 bg-stone-900 text-white text-sm px-5 py-2.5 rounded-full font-medium hover:bg-stone-700 transition-colors"
          >
            <span className="text-base leading-none">+</span> Nuevo evento
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-zinc-200">
            <p className="text-4xl mb-4">💌</p>
            <h2 className="text-xl font-semibold text-stone-800 mb-2">Aún no tienes eventos</h2>
            <p className="text-stone-500 text-sm mb-6">Crea tu primera invitación digital en menos de 2 minutos.</p>
            <Link
              href="/admin/events/new"
              className="inline-flex items-center gap-2 bg-stone-900 text-white text-sm px-6 py-3 rounded-full font-medium hover:bg-stone-700 transition-colors"
            >
              Crear primera invitación
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-md hover:border-rose-200 transition-all group"
              >
                <div
                  className={`h-1.5 ${
                    event.is_published
                      ? "bg-gradient-to-r from-rose-400 to-fuchsia-400"
                      : "bg-zinc-200"
                  }`}
                />
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-medium px-2.5 py-0.5 rounded-full border ${
                        event.is_published
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200"
                      }`}
                    >
                      {event.is_published ? "Publicado" : "Borrador"}
                    </span>
                    <span className="text-xs text-stone-400 bg-zinc-50 border border-zinc-100 px-2.5 py-0.5 rounded-full shrink-0">
                      {EVENT_TYPE_LABELS[event.event_type] ?? "Evento"}
                    </span>
                  </div>

                  <h3
                    className="font-semibold text-stone-800 text-lg leading-snug mb-1 group-hover:text-rose-700 transition-colors"
                    style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                  >
                    {event.title}
                  </h3>
                  <p className="text-xs text-stone-400 font-mono mb-4">/i/{event.slug}</p>

                  <div className="flex items-center gap-2 pt-3 border-t border-zinc-100">
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="flex-1 text-center text-sm font-medium text-stone-700 hover:text-stone-900 py-1.5 rounded-lg hover:bg-zinc-50 transition-colors"
                    >
                      Editar
                    </Link>
                    <div className="w-px h-4 bg-zinc-200" />
                    <Link
                      href={`/i/${event.slug}`}
                      target="_blank"
                      className="flex-1 text-center text-sm font-medium text-rose-500 hover:text-rose-700 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                    >
                      Ver ↗
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
