import Link from "next/link";
import { NotificationBell } from "@/components/ui/notification-bell";
import { LinkButton } from "@/components/ui/button";

const links = [
  { href: "/villages", label: "Pueblos" },
  { href: "/activities", label: "Actividades" },
  { href: "/community", label: "Comunidad" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#1F3D2B12] bg-[#FAF7F0]/94 backdrop-blur">
      <div className="page-shell flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 font-black text-[#1F3D2B]">
          <span className="grid size-10 place-items-center rounded-2xl bg-[#3A7D44] text-white">
            CP
          </span>
          <span className="hidden text-lg sm:inline">ConectaPueblos</span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-bold text-[#1F3D2B]/78 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-[#3A7D44]">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <NotificationBell />
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-bold text-[#1F3D2B] hover:bg-[#1F3D2B0d] sm:inline-flex"
          >
            Entrar
          </Link>
          <LinkButton href="/register" className="min-h-10 px-4">
            Unirme
          </LinkButton>
        </div>
      </div>
    </header>
  );
}
