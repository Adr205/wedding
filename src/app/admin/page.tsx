import Link from "next/link";
import { requirePageUser } from "@/lib/auth/requireUser";
import { getMyRole, isSuperAdmin } from "@/lib/auth/getRole";
import { getDashboardStats } from "@/features/admin/data/dashboard";

const EVENT_TYPE_LABELS: Record<string, string> = {
  wedding: "Boda",
  xv: "XV Años",
  other: "Evento",
};

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-widest text-zinc-400 mb-1">{label}</p>
      <p className="text-3xl font-bold text-stone-900">{value}</p>
      {sub ? <p className="text-xs text-zinc-400 mt-1">{sub}</p> : null}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatRelative(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return "Pasado";
  if (days === 0) return "¡Hoy!";
  if (days === 1) return "Mañana";
  if (days <= 30) return `En ${days} días`;
  const months = Math.ceil(days / 30);
  return `En ${months} mes${months > 1 ? "es" : ""}`;
}

function formatTimeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Ahora mismo";
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `Hace ${hrs}h`;
  const days = Math.floor(hrs / 24);
  return `Hace ${days}d`;
}

export default async function AdminDashboard() {
  const user = await requirePageUser();
  const role = await getMyRole(user.id);
  const superAdmin = isSuperAdmin(role);
  const stats = await getDashboardStats(user.id, superAdmin);

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Header */}
      <header className="bg-white border-b border-zinc-200 px-6 py-4">
        <div className="mx-auto max-w-5xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-rose-400">✦</span>
            <span className="font-semibold tracking-wide text-stone-800">AvCenter</span>
            <span className="text-xs text-stone-400 tracking-[0.2em] uppercase">Admin</span>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/admin/events" className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
              Eventos
            </Link>
            <form action="/api/auth/logout" method="post">
              <button className="text-sm text-stone-500 hover:text-stone-900 transition-colors">
                Cerrar sesión
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10 space-y-8">
        {/* Title row */}
        {superAdmin ? (
          <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-stone-900">
              SUPER ADMIN
            </span>
            <p className="text-sm text-amber-800">
              Estás viendo métricas y eventos de <strong>todos los usuarios</strong>.
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold text-stone-900"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Panel general
            </h1>
            <p className="text-stone-500 text-sm mt-0.5">
              {superAdmin ? "Vista global — todos los usuarios" : "Resumen de todos tus eventos activos"}
            </p>
          </div>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-1.5 bg-stone-900 text-white text-sm px-5 py-2.5 rounded-full font-medium hover:bg-stone-700 transition-colors"
          >
            <span className="text-base leading-none">+</span> Nuevo evento
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Total eventos" value={stats.totalEvents} />
          <StatCard
            label="Publicados"
            value={stats.publishedEvents}
            sub={`${stats.draftEvents} borrador${stats.draftEvents !== 1 ? "es" : ""}`}
          />
          <StatCard label="Confirmaciones" value={stats.totalConfirmations} />
          <StatCard
            label="Asistentes"
            value={stats.totalAttendees}
            sub="incluye acompañantes"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Upcoming events */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-stone-800">Próximos eventos</h2>
              <Link href="/admin/events" className="text-xs text-rose-500 hover:text-rose-700">
                Ver todos →
              </Link>
            </div>

            {stats.upcomingEvents.length === 0 ? (
              <p className="text-sm text-zinc-400 py-4 text-center">No hay eventos próximos.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {stats.upcomingEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/admin/events/${event.id}`}
                    className="flex items-center gap-4 py-3 hover:bg-zinc-50 -mx-1 px-1 rounded-lg transition-colors group"
                  >
                    {/* Date block */}
                    <div className="w-12 shrink-0 text-center">
                      <p className="text-lg font-bold text-stone-800 leading-none">
                        {new Date(event.main_date).getDate()}
                      </p>
                      <p className="text-[10px] uppercase text-zinc-400 tracking-wide capitalize">
                        {new Date(event.main_date).toLocaleString("es-MX", { month: "short" })}
                      </p>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-800 text-sm truncate group-hover:text-rose-700 transition-colors">
                        {event.title}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {EVENT_TYPE_LABELS[event.event_type] ?? "Evento"} · {formatRelative(event.main_date)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          event.is_published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}
                      >
                        {event.is_published ? "Publicado" : "Borrador"}
                      </span>
                      {event.confirmations > 0 ? (
                        <span className="text-[10px] text-zinc-400">
                          {event.confirmations} confirm.
                        </span>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Recent RSVPs */}
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="font-semibold text-stone-800 mb-4">Confirmaciones recientes</h2>

            {stats.recentRsvps.length === 0 ? (
              <p className="text-sm text-zinc-400 py-4 text-center">Aún no hay confirmaciones.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {stats.recentRsvps.map((rsvp) => (
                  <div key={rsvp.id} className="flex items-center gap-3 py-3">
                    {/* Avatar placeholder */}
                    <div className="h-8 w-8 shrink-0 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 text-xs font-semibold">
                      {rsvp.guest_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-800 truncate">{rsvp.guest_name}</p>
                      <p className="text-xs text-zinc-400 truncate">
                        {rsvp.event_title}
                        {rsvp.plus_ones > 0 ? ` · +${rsvp.plus_ones} acomp.` : ""}
                      </p>
                    </div>
                    <span className="text-[10px] text-zinc-400 shrink-0">{formatTimeAgo(rsvp.created_at)}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* All events quick list */}
        {stats.totalEvents > 0 ? (
          <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-stone-800">Todos los eventos</h2>
              <Link href="/admin/events/new" className="text-xs text-rose-500 hover:text-rose-700">
                + Nuevo
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 text-left text-xs uppercase tracking-wider text-zinc-400">
                    <th className="pb-2 pr-4">Título</th>
                    <th className="pb-2 pr-4">Tipo</th>
                    <th className="pb-2 pr-4">Fecha</th>
                    <th className="pb-2 pr-4 text-center">Estado</th>
                    <th className="pb-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {stats.upcomingEvents.concat(
                    // Show all events by fetching a bit differently — here we use upcomingEvents as preview
                    // Full list is at /admin/events
                    []
                  ).map((event) => (
                    <tr key={event.id}>
                      <td className="py-2.5 pr-4 font-medium text-stone-800">{event.title}</td>
                      <td className="py-2.5 pr-4 text-zinc-500">{EVENT_TYPE_LABELS[event.event_type] ?? "Evento"}</td>
                      <td className="py-2.5 pr-4 text-zinc-500">{formatDate(event.main_date)}</td>
                      <td className="py-2.5 pr-4 text-center">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          event.is_published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-zinc-100 text-zinc-500"
                        }`}>
                          {event.is_published ? "Publicado" : "Borrador"}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          <Link href={`/admin/events/${event.id}`} className="text-xs text-stone-600 hover:text-stone-900">
                            Editar
                          </Link>
                          <Link href={`/i/${event.slug}`} target="_blank" className="text-xs text-rose-500 hover:text-rose-700">
                            Ver ↗
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 pt-3 border-t border-zinc-100 text-center">
                <Link href="/admin/events" className="text-sm text-rose-500 hover:text-rose-700">
                  Ver listado completo →
                </Link>
              </div>
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
