"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/dashboard", label: "Inicio", icon: "In" },
  { href: "/community", label: "Comunidad", icon: "Co" },
  { href: "/activities", label: "Planes", icon: "Pl" },
  { href: "/villages", label: "Pueblos", icon: "Pu" },
  { href: "/profile", label: "Perfil", icon: "Yo" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Navegación principal mobile"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#1F3D2B14] bg-[#FAF7F0]/96 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_30px_rgba(31,61,43,0.10)] backdrop-blur md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {items.map((item) => {
          const active =
            pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "grid min-h-14 place-items-center rounded-2xl px-1 text-[11px] font-black transition-colors focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]",
                active
                  ? "bg-[#3A7D44] text-white"
                  : "text-[#1F3D2B]/62 hover:bg-[#1F3D2B0d]",
              )}
            >
              <span className="grid size-6 place-items-center rounded-full bg-current/10 text-[10px] leading-none">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
