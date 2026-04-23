import Link from "next/link";
import { requirePageUser } from "@/lib/auth/requireUser";

export default async function AdminPage() {
  await requirePageUser();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 space-y-6 px-6 py-10">
      <h1 className="text-3xl font-bold">Panel administrador</h1>
      <p className="text-zinc-600">Crea y administra los sitios de invitación de tus clientes.</p>
      <div className="flex gap-3">
        <Link href="/admin/events" className="inline-flex rounded-xl bg-zinc-900 px-4 py-2 font-semibold text-white hover:bg-zinc-700">
          Ir a eventos
        </Link>
        <form action="/api/auth/logout" method="post">
          <button className="inline-flex rounded-xl border border-zinc-300 px-4 py-2 font-semibold hover:bg-zinc-100">Cerrar sesión</button>
        </form>
      </div>
    </main>
  );
}
