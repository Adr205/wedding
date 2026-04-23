import { notFound } from "next/navigation";
import { InvitationRenderer } from "@/features/invitation/components/InvitationRenderer";
import { getInvitationBySlug } from "@/features/invitation/data/getInvitationBySlug";

type InvitationPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { slug } = await params;

  const invitation = await getInvitationBySlug(slug);

  if (!invitation) {
    if (slug === "demo") {
      return (
        <main className="mx-auto w-full max-w-3xl flex-1 space-y-4 px-6 py-12">
          <h1 className="text-3xl font-bold">Demo de invitación</h1>
          <p>
            Para ver contenido real conecta Supabase y crea un evento desde <strong>/admin/events/new</strong>.
          </p>
        </main>
      );
    }
    notFound();
  }

  return <InvitationRenderer invitation={invitation} />;
}
