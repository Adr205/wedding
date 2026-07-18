import Link from "next/link";
import { ModerationManager } from "@/features/admin/components/ModerationManager";
import { getEventBundle } from "@/features/admin/data/events";
import { listMessages, listUploads } from "@/features/admin/data/community";
import { requirePageUser } from "@/lib/auth/requireUser";
import { getMyRole, isSuperAdmin } from "@/lib/auth/getRole";

type ModerationPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ModerationPage({ params }: ModerationPageProps) {
  const user = await requirePageUser();
  const { id } = await params;
  const superAdmin = isSuperAdmin(await getMyRole(user.id));

  const [bundle, messages, uploads] = await Promise.all([
    getEventBundle(id, user.id, superAdmin),
    listMessages(id, user.id, superAdmin),
    listUploads(id, user.id, superAdmin),
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
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/events/${id}`}
          className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors"
        >
          ← Editar evento
        </Link>
        <h1 className="text-3xl font-bold">Moderación</h1>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">
        Aprueba o elimina los mensajes y fotos que envían tus invitados. Solo lo aprobado se muestra en la invitación.
      </p>

      <ModerationManager eventId={id} initialMessages={messages} initialUploads={uploads} />
    </main>
  );
}
