import Link from "next/link";
import { notFound } from "next/navigation";
import { requirePageUser } from "@/lib/auth/requireUser";
import { getInvitationPreview } from "@/features/admin/data/preview";
import { InvitationRenderer } from "@/features/invitation/components/InvitationRenderer";

type PreviewPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventPreviewPage({ params }: PreviewPageProps) {
  const user = await requirePageUser();
  const { id } = await params;

  const invitation = await getInvitationPreview(id, user.id);
  if (!invitation) notFound();

  return (
    <>
      {/* Admin preview banner */}
      <div className="sticky top-0 z-50 flex items-center justify-between gap-4 bg-stone-900 px-6 py-3 text-white shadow-lg">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-amber-400 px-2.5 py-0.5 text-xs font-semibold text-stone-900">
            VISTA PREVIA
          </span>
          <p className="text-sm opacity-70">
            Esta es una vista previa — los invitados no pueden ver borradores.
          </p>
        </div>
        <Link
          href={`/admin/events/${id}`}
          className="rounded-lg border border-white/20 px-4 py-1.5 text-sm font-medium hover:bg-white/10 transition-colors shrink-0"
        >
          ← Volver a editar
        </Link>
      </div>

      <InvitationRenderer invitation={invitation} />
    </>
  );
}
