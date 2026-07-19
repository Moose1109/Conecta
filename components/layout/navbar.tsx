"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ResponsiveSidebarDrawer } from "@/components/layout/responsive-sidebar-drawer";
import { UserMenu } from "@/components/layout/user-menu";
import { NotificationBell } from "@/components/ui/notification-bell";
import { LinkButton } from "@/components/ui/button";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/", label: "Inicio" },
  { href: "/villages", label: "Pueblos" },
  { href: "/activities", label: "Actividades" },
  { href: "/community", label: "Comunidad" },
];

export function Navbar() {
  const pathname = usePathname();
  const { token } = useAuthSession();
  const isAuthenticated = Boolean(token);

  return (
    <header className="sticky top-0 z-40 border-b border-[#1F3D2B12] bg-[#FAF7F0]/94 backdrop-blur">
      <div className="page-shell flex min-h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          {isAuthenticated ? <ResponsiveSidebarDrawer /> : null}
          <Link
            href={isAuthenticated ? "/community" : "/"}
            className="flex min-w-0 items-center gap-3 font-black text-[#1F3D2B]"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#3A7D44] text-white">
              CP
            </span>
            <span className="hidden truncate text-lg sm:inline">ConectaPueblos</span>
          </Link>
        </div>
        {!isAuthenticated ? (
          <nav className="hidden items-center gap-5 text-sm font-bold text-[#1F3D2B]/78 md:flex">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3 py-2 transition-colors hover:bg-[#1F3D2B0d] hover:text-[#3A7D44]",
                  (pathname === link.href ||
                    (link.href !== "/" && pathname.startsWith(`${link.href}/`))) &&
                    "bg-white text-[#3A7D44] shadow-sm",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
        <div className="flex items-center gap-2">
          {isAuthenticated ? <NotificationBell /> : null}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-sm font-bold text-[#1F3D2B] hover:bg-[#1F3D2B0d] sm:inline-flex"
              >
                Entrar
              </Link>
              <LinkButton href="/register" className="min-h-10 px-4">
                Crear cuenta
              </LinkButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
