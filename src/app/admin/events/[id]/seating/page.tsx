import Link from "next/link";
import { SeatingManager } from "@/features/admin/components/SeatingManager";
import { getEventBundle } from "@/features/admin/data/events";
import { listGuests } from "@/features/admin/data/guests";
import { listTables } from "@/features/admin/data/tables";
import { requirePageUser } from "@/lib/auth/requireUser";
import { getMyRole, isSuperAdmin } from "@/lib/auth/getRole";

type SeatingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function SeatingPage({ params }: SeatingPageProps) {
  const user = await requirePageUser();
  const { id } = await params;
  const superAdmin = isSuperAdmin(await getMyRole(user.id));

  const [bundle, tables, guests] = await Promise.all([
    getEventBundle(id, user.id, superAdmin),
    listTables(id, user.id, superAdmin),
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
    <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-6 py-10">
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/events/${id}`}
          className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          ← Editar evento
        </Link>
        <h1 className="text-3xl font-bold">Distribución de mesas</h1>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Arrastra invitados a las mesas. Puedes asignar a cualquier invitado, haya confirmado o no.
      </p>

      <SeatingManager
        eventId={id}
        initialTables={tables}
        initialGuests={guests}
      />
    </main>
  );
}
