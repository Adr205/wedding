import { EventForm } from "@/features/admin/components/EventForm";
import { getDraftEventDefaults, getEventBundle } from "@/features/admin/data/events";
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

  const bundle = await getEventBundle(id, user.id);

  if (!bundle) {
    return (
      <main className="mx-auto w-full max-w-5xl flex-1 space-y-4 px-6 py-10">
        <h1 className="text-3xl font-bold">Evento no encontrado</h1>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-6 py-10">
      <h1 className="text-3xl font-bold">Editar evento</h1>
      <EventForm mode="edit" eventId={id} initialValues={bundle} />
    </main>
  );
}
