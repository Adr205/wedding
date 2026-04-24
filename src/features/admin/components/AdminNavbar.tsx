"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/events", label: "Eventos", exact: false },
];

export function AdminNavbar() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        {/* Brand */}
        <Link href="/admin" className="flex items-center gap-2">
          <span className="text-rose-400">✦</span>
          <span className="font-semibold tracking-wide text-stone-800">AvCenter</span>
          <span className="text-xs text-stone-400 tracking-[0.2em] uppercase">Admin</span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {NAV_LINKS.map(({ href, label, exact }) => (
            <Link
              key={href}
              href={href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                isActive(href, exact)
                  ? "bg-stone-100 text-stone-900"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-900"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <form action="/api/auth/logout" method="post">
          <button
            type="submit"
            className="rounded-lg px-3 py-1.5 text-sm text-stone-400 transition-colors hover:bg-zinc-100 hover:text-stone-700"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </header>
  );
}
