import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-stone-900">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-rose-100/60">
        <div className="flex items-center gap-2">
          <span className="text-rose-400 text-lg">✦</span>
          <span className="font-semibold tracking-wide text-stone-800">AvCenter</span>
          <span className="text-xs text-stone-400 tracking-[0.2em] uppercase hidden sm:inline">Invitations</span>
        </div>
        <Link
          href="/admin/login"
          className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors border border-stone-300 rounded-full px-4 py-1.5 hover:border-stone-500"
        >
          Acceso admin
        </Link>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-fuchsia-50/50" />
        <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-rose-100/20 blur-3xl -translate-y-1/3 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-fuchsia-100/20 blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.35em] text-rose-500 uppercase mb-8">
            <span className="w-6 h-px bg-rose-300 inline-block" />
            Invitaciones digitales de lujo
            <span className="w-6 h-px bg-rose-300 inline-block" />
          </p>

          <h1
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            El primer &ldquo;sí&rdquo; que<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-fuchsia-500">
              recordarán siempre
            </span>
          </h1>

          <p className="text-lg text-stone-500 max-w-2xl mx-auto leading-relaxed mb-10">
            Crea invitaciones digitales que capturan la magia de bodas, XV años y momentos únicos.
            Elegantes, personalizables y listas en minutos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3.5 rounded-full font-medium hover:bg-stone-700 transition-colors text-sm"
            >
              Crear invitación gratis →
            </Link>
            <Link
              href="/i/demo"
              className="inline-flex items-center gap-2 text-stone-600 px-8 py-3.5 rounded-full font-medium hover:text-stone-900 transition-colors text-sm border border-stone-200 hover:border-stone-400"
            >
              Ver ejemplo real
            </Link>
          </div>
        </div>

        {/* Mockup */}
        <div className="relative mx-auto max-w-xl mt-16">
          <div className="bg-gradient-to-b from-rose-50 to-white rounded-3xl border border-rose-100 shadow-2xl shadow-rose-100/60 p-8 text-center overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: "radial-gradient(circle, #be185d 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            <p className="text-[10px] tracking-[0.4em] text-rose-400 uppercase mb-3">Invitación de boda</p>
            <p
              className="text-3xl text-stone-800 mb-1"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Sofía &amp; Alejandro
            </p>
            <p className="text-xs text-stone-400 mb-5">Sábado, 14 de junio de 2025 · 17:00 hrs</p>
            <div className="flex justify-center items-center gap-3 mb-5">
              <div className="w-14 h-px bg-rose-200" />
              <span className="text-rose-300 text-xs">✦</span>
              <div className="w-14 h-px bg-rose-200" />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {["🌸", "💐", "🌹"].map((emoji) => (
                <div key={emoji} className="aspect-[4/3] rounded-xl bg-rose-100/60 flex items-center justify-center text-2xl">
                  {emoji}
                </div>
              ))}
            </div>
            <div className="flex gap-2 justify-center">
              <div className="bg-rose-600 text-white text-xs px-4 py-2 rounded-full">Confirmar asistencia</div>
              <div className="border border-rose-200 text-rose-600 text-xs px-4 py-2 rounded-full">📅 Calendario</div>
            </div>
          </div>
          <div className="absolute -left-6 top-1/3 bg-white border border-rose-100 rounded-xl px-3 py-2 shadow-lg text-xs text-stone-600 hidden sm:block">
            ✓ RSVP por WhatsApp
          </div>
          <div className="absolute -right-6 top-2/3 bg-white border border-fuchsia-100 rounded-xl px-3 py-2 shadow-lg text-xs text-stone-600 hidden sm:block">
            ✓ Galería de fotos
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-stone-900">
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
          {[
            { value: "2 min", label: "Para tener tu invitación lista" },
            { value: "100%", label: "Optimizada para móvil" },
            { value: "∞", label: "Momentos para compartir" },
          ].map((stat) => (
            <div key={stat.label}>
              <p
                className="text-4xl font-bold text-white mb-1.5"
                style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
              >
                {stat.value}
              </p>
              <p className="text-stone-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] text-rose-400 uppercase mb-3">Lo que incluye</p>
            <h2
              className="text-4xl font-bold text-stone-900 leading-snug"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Todo lo que necesitas para<br />el día más especial
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { icon: "💌", title: "URLs únicas", desc: "Cada invitación tiene su propio enlace personalizado para compartir fácilmente." },
              { icon: "🎨", title: "Temas elegantes", desc: "Elige entre distintos estilos visuales que van con la personalidad del evento." },
              { icon: "📱", title: "RSVP por WhatsApp", desc: "Confirma asistentes directamente desde WhatsApp con un mensaje prediseñado." },
              { icon: "🗺️", title: "Ubicaciones con mapas", desc: "Guía a tus invitados con enlaces directos a Google Maps para cada lugar." },
              { icon: "📸", title: "Galería de fotos", desc: "Muestra los mejores momentos con una galería hermosa y optimizada para móvil." },
              { icon: "📅", title: "Botón de calendario", desc: "Un clic y el evento queda guardado en Google Calendar automáticamente." },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-zinc-100 hover:border-rose-200 hover:bg-rose-50/30 transition-all cursor-default"
              >
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-stone-800 mb-1.5">{feature.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 bg-gradient-to-br from-rose-50 via-white to-fuchsia-50">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center items-center gap-4 mb-6">
            <div className="w-16 h-px bg-rose-300" />
            <span className="text-rose-400 text-lg">✦</span>
            <div className="w-16 h-px bg-rose-300" />
          </div>
          <h2
            className="text-4xl font-bold text-stone-900 mb-4 leading-snug"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            ¿Lista para crear algo hermoso?
          </h2>
          <p className="text-stone-500 mb-8 leading-relaxed">
            Tus clientes merecen una invitación que esté a la altura del momento más importante de su vida.
          </p>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-2 bg-stone-900 text-white px-10 py-4 rounded-full font-medium hover:bg-stone-700 transition-colors"
          >
            Empezar ahora — es gratis →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-100 text-center text-xs text-stone-400">
        <p>© 2025 AvCenter Invitations · Hecho con amor para momentos que duran para siempre</p>
      </footer>
    </div>
  );
}
