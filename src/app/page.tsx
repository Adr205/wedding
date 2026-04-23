import Link from "next/link";
import { Button, Card, CardContent, CardHeader, Chip } from "@heroui/react";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-12 md:py-16">
      <header className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">AvCenter Invitations</p>
        <Link href="/admin/login">
          <Button size="sm" variant="outline">
            Login administrador
          </Button>
        </Link>
      </header>

      <Card className="relative overflow-hidden border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-fuchsia-50 p-2 shadow-sm dark:border-zinc-700 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800">
        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute -bottom-20 -left-16 h-56 w-56 rounded-full bg-fuchsia-200/30 blur-3xl" />
        <CardContent className="relative space-y-6 p-8 md:p-10">
          <Chip variant="soft" className="w-fit">
            AvCenter Invitations
          </Chip>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-zinc-900 dark:text-zinc-100 md:text-5xl">
            Diseña invitaciones digitales inolvidables para bodas, XV años y eventos especiales
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-zinc-600 dark:text-zinc-300 md:text-lg">
            Crea sitios elegantes para tus clientes con galería de fotos, agenda del evento, ubicaciones, RSVP por WhatsApp y botón para agregar al calendario.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/admin/events">
              <Button size="lg">Crear invitación</Button>
            </Link>
            <Link href="/admin/login">
              <Button variant="secondary" size="lg">
                Iniciar sesión admin
              </Button>
            </Link>
            <Link href="/i/demo">
              <Button variant="outline" size="lg">
                Ver demo pública
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { value: "2 min", label: "Para publicar un sitio" },
          { value: "100%", label: "Responsive para invitados" },
          { value: "Multi", label: "Eventos y temas visuales" },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="p-5">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{item.value}</p>
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          "Gestión multi-evento con URLs únicas por invitación.",
          "Temas visuales personalizables para distintos estilos.",
          "RSVP por WhatsApp y agenda integrada para invitados.",
          "Ubicaciones con enlaces a mapas por momento del evento.",
          "Panel administrador para editar contenido en minutos.",
          "Experiencia pública optimizada para móvil.",
        ].map((feature) => (
          <Card key={feature}>
            <CardContent className="p-5">
              <p className="text-zinc-700 dark:text-zinc-300">{feature}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader className="flex flex-col items-start gap-1 px-7 pt-6">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">Comienza a crear tu primer sitio</h2>
          <p className="text-zinc-600 dark:text-zinc-300">Entra al panel, crea un evento y comparte el link en segundos.</p>
        </CardHeader>
        <CardContent className="px-7 pb-7 pt-0">
          <div className="flex justify-start md:justify-end">
            <Link href="/admin/events/new">
              <Button size="lg">Nuevo evento</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
