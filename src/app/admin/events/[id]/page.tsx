import Link from "next/link";
import { EventForm } from "@/features/admin/components/EventForm";
import { GuestManager } from "@/features/admin/components/GuestManager";
import { QRDownloadButton } from "@/features/admin/components/QRDownloadButton";
import { getDraftEventDefaults, getEventBundle } from "@/features/admin/data/events";
import { listGuests } from "@/features/admin/data/guests";
import { requirePageUser } from "@/lib/auth/requireUser";
import { getMyRole, isSuperAdmin } from "@/lib/auth/getRole";

type AdminEventDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function AdminEventDetailPage({ params }: AdminEventDetailPageProps) {
  const user = await requirePageUser();
  const { id } = await params;
  const role = await getMyRole(user.id);
  const superAdmin = isSuperAdmin(role);

  if (id === "new") {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-6 py-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/events" className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
            ← Eventos
          </Link>
          <h1 className="text-3xl font-bold">Nuevo evento</h1>
        </div>
        <EventForm mode="create" initialValues={getDraftEventDefaults()} />
      </main>
    );
  }

  const [bundle, guests] = await Promise.all([
    getEventBundle(id, user.id, superAdmin),
    listGuests(id, user.id, superAdmin),
  ]);

  if (!bundle) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-4 px-6 py-10">
        <h1 className="text-3xl font-bold">Evento no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <Link href="/admin/events" className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
            ← Eventos
          </Link>
          <h1 className="text-3xl font-bold">Editar evento</h1>
        </div>
        <div className="flex items-center gap-3">
          <QRDownloadButton eventId={id} slug={bundle.slug} />
          <Link
            href={`/admin/events/${id}/seating`}
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300"
          >
            Mesas
          </Link>
          <Link
            href={`/admin/events/${id}/preview`}
            target="_blank"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors dark:border-zinc-600 dark:text-zinc-300"
          >
            Vista previa ↗
          </Link>
          {bundle.is_published ? (
            <Link
              href={`/i/${bundle.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
            >
              Ver publicada ↗
            </Link>
          ) : null}
        </div>
      </div>
      <EventForm mode="edit" eventId={id} initialValues={bundle} />

      <GuestManager
        eventId={id}
        slug={bundle.slug}
        eventTitle={bundle.title}
        isPublished={bundle.is_published}
        initialGuests={guests}
      />
    </main>
  );
}
