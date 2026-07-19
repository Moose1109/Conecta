"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigationItems } from "@/components/layout/navigation-items";
import { Card } from "@/components/ui/card";
import { AuthIcon } from "@/features/auth/auth-icons";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();
  const { token } = useAuthSession();

  return (
    <Card className="p-3 lg:sticky lg:top-24 lg:p-4">
      <p className="px-2 text-xs font-black uppercase tracking-[0.16em] text-[#3A7D44]">
        {token ? "Explorar" : "Conecta"}
      </p>
      <nav
        aria-label="Navegación social"
        className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1"
      >
        {primaryNavigationItems.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "group flex min-h-16 items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black transition-all hover:-translate-y-0.5 hover:bg-[#1F3D2B0d] hover:text-[#1F3D2B] lg:min-h-[4.5rem]",
              (pathname === link.href || pathname.startsWith(`${link.href}/`))
                ? "bg-[#3A7D44] text-white shadow-[0_14px_32px_rgba(58,125,68,0.22)] hover:bg-[#3A7D44] hover:text-white"
                : "text-[#1F3D2B]/72",
            )}
          >
            <span
              className={cn(
                "grid size-10 shrink-0 place-items-center rounded-2xl bg-[#1F3D2B0d] text-[#3A7D44] transition-colors",
                (pathname === link.href || pathname.startsWith(`${link.href}/`)) &&
                  "bg-white/16 text-white",
              )}
            >
              <AuthIcon className="size-5" name={link.icon} />
            </span>
            <span className="min-w-0">
              <span className="block">{link.label}</span>
              <span
                className={cn(
                  "mt-0.5 hidden text-xs font-bold leading-5 text-[#1E1E1E]/52 lg:block",
                  (pathname === link.href || pathname.startsWith(`${link.href}/`)) &&
                    "text-white/72",
                )}
              >
                {link.meta}
              </span>
            </span>
          </Link>
        ))}
      </nav>
    </Card>
  );
}
