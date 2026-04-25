import Link from "next/link";

const FEATURES = [
  {
    icon: "🧩",
    title: "Editor de bloques",
    desc: "Construye la invitación arrastrando y soltando bloques. Sin código, sin límites.",
  },
  {
    icon: "✨",
    title: "Animaciones por bloque",
    desc: "Cada sección puede entrar con fade, slide o zoom al hacer scroll. Ajustable por bloque.",
  },
  {
    icon: "🎨",
    title: "Temas y colores propios",
    desc: "Elige el tema visual, color del texto y fondo de cards — con efecto de vidrio incluido.",
  },
  {
    icon: "📸",
    title: "Galería con subida masiva",
    desc: "Sube decenas de fotos de golpe. Visualización en cuadrícula o carrusel.",
  },
  {
    icon: "🎬",
    title: "Video embed",
    desc: "Inserta cualquier video de YouTube o Vimeo directamente en la invitación.",
  },
  {
    icon: "📍",
    title: "Mapas integrados",
    desc: "Mapa de Google embebido por cada lugar. Botón directo para abrir en Maps.",
  },
  {
    icon: "📅",
    title: "Itinerario del evento",
    desc: "Detalla cada momento del día con hora y descripción en una línea de tiempo elegante.",
  },
  {
    icon: "💬",
    title: "RSVP por WhatsApp",
    desc: "Confirmación de asistencia con mensaje personalizable directo a WhatsApp.",
  },
  {
    icon: "⏱️",
    title: "Cuenta regresiva",
    desc: "Contador en tiempo real hasta el gran día. Estilo numérico o minimalista.",
  },
  {
    icon: "👗",
    title: "Código de vestimenta",
    desc: "Sección dedicada con paleta de colores sugeridos para los invitados.",
  },
  {
    icon: "🎁",
    title: "Mesa de regalos",
    desc: "Lista de tiendas con links directos. Liverpool, Amazon, o cualquier URL.",
  },
  {
    icon: "⚡",
    title: "Grid y Flex containers",
    desc: "Agrupa bloques en cuadrículas o filas flexibles para layouts completamente libres.",
  },
];

const BLOCK_TYPES = [
  "Hero", "Cuenta regresiva", "Cita / Frase", "Texto",
  "Foto única", "Galería", "Video", "Itinerario",
  "Ubicación", "RSVP", "Separador", "Código de vestimenta",
  "Mesa de regalos", "Grid", "Flex",
];

const STEPS = [
  {
    num: "01",
    title: "Crea el evento",
    desc: "Define el nombre, fecha, tema visual y paleta de colores.",
  },
  {
    num: "02",
    title: "Construye la página",
    desc: "Agrega bloques, reordénalos con drag & drop y configura cada sección.",
  },
  {
    num: "03",
    title: "Comparte el link",
    desc: "Copia la URL y envíala por WhatsApp, Instagram o donde quieras.",
  },
];

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

      {/* ── Hero ─────────────────────────────────────────── */}
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
            Editor de bloques, 15 tipos de sección, animaciones, galería, mapas, video y más.
            Crea invitaciones que impresionan — sin tocar una línea de código.
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
              <div className="border border-rose-200 text-rose-600 text-xs px-4 py-2 rounded-full">📍 Mapa</div>
            </div>
          </div>
          <div className="absolute -left-6 top-1/4 bg-white border border-rose-100 rounded-xl px-3 py-2 shadow-lg text-xs text-stone-600 hidden sm:block">
            ✨ Animaciones al scroll
          </div>
          <div className="absolute -right-6 top-1/2 bg-white border border-fuchsia-100 rounded-xl px-3 py-2 shadow-lg text-xs text-stone-600 hidden sm:block">
            🎬 Video embed
          </div>
          <div className="absolute -left-4 bottom-10 bg-white border border-emerald-100 rounded-xl px-3 py-2 shadow-lg text-xs text-stone-600 hidden sm:block">
            🧩 15 tipos de bloque
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-stone-900">
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-10 text-center">
          {[
            { value: "15", label: "Tipos de bloque" },
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

      {/* ── How it works ─────────────────────────────────── */}
      <section className="py-20 px-6 bg-rose-50/40">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] text-rose-400 uppercase mb-3">Así funciona</p>
            <h2
              className="text-4xl font-bold text-stone-900"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Listo en minutos
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="text-center">
                <p
                  className="text-6xl font-bold text-rose-200 mb-4 leading-none"
                  style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
                >
                  {step.num}
                </p>
                <h3 className="font-semibold text-stone-800 text-lg mb-2">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features grid ────────────────────────────────── */}
      <section className="py-20 px-6 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.3em] text-rose-400 uppercase mb-3">Todo incluido</p>
            <h2
              className="text-4xl font-bold text-stone-900 leading-snug"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              Construido para impresionar
            </h2>
            <p className="text-stone-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed">
              Cada función fue diseñada para que la invitación sea tan especial como el evento.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {FEATURES.map((feature) => (
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

      {/* ── Block types ──────────────────────────────────── */}
      <section className="py-20 px-6 bg-stone-900">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs tracking-[0.3em] text-rose-400 uppercase mb-3">Bloques disponibles</p>
          <h2
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            Una sección para cada momento
          </h2>
          <p className="text-stone-400 text-sm mb-10 max-w-lg mx-auto leading-relaxed">
            Combina los bloques que necesites en el orden que quieras. Cada uno es completamente configurable.
          </p>
          <div className="flex flex-wrap gap-2.5 justify-center">
            {BLOCK_TYPES.map((type) => (
              <span
                key={type}
                className="px-4 py-2 rounded-full border border-stone-700 text-stone-300 text-sm hover:border-rose-500 hover:text-rose-300 transition-colors cursor-default"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────── */}
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

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="py-8 px-6 border-t border-zinc-100 text-center text-xs text-stone-400">
        <p>© 2026 AvCenter Invitations · Hecho con amor para momentos que duran para siempre</p>
      </footer>
    </div>
  );
}
