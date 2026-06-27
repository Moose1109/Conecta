import Link from "next/link";
import { Card } from "@/components/ui/card";

const links = [
  { href: "/dashboard", label: "Inicio social" },
  { href: "/community", label: "Comunidad" },
  { href: "/activities", label: "Actividades" },
  { href: "/villages", label: "Pueblos" },
  { href: "/profile", label: "Perfil" },
];

export function SidebarNav() {
  return (
    <Card className="sticky top-24 p-4">
      <p className="px-2 text-xs font-black uppercase tracking-[0.16em] text-[#3A7D44]">
        Conecta
      </p>
      <nav aria-label="Navegación social" className="mt-3 grid gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl px-3 py-3 text-sm font-black text-[#1F3D2B]/72 transition-colors hover:bg-[#1F3D2B0d] hover:text-[#1F3D2B]"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </Card>
  );
}
