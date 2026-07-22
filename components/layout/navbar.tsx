"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, Search } from "lucide-react";
import { ResponsiveSidebarDrawer } from "@/components/layout/responsive-sidebar-drawer";
import { isNavigationRoute, isSocialRoute } from "@/components/layout/social-routes";
import { UserMenu } from "@/components/layout/user-menu";
import { NotificationBell } from "@/components/ui/notification-bell";
import { LinkButton } from "@/components/ui/button";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/villages", label: "Pueblos" },
  { href: "/activities", label: "Actividades" },
  { href: "/community", label: "Comunidad" },
];

export function Navbar() {
  const pathname = usePathname();
  const { token } = useAuthSession();
  const isAuthenticated = Boolean(token);
  const socialRoute = isSocialRoute(pathname);

  return (
    <header className="sticky top-0 z-40 border-b border-[#184B3412] bg-[#F7F2E8]/92 backdrop-blur-xl">
      <div className="page-shell flex min-h-[72px] items-center gap-3 lg:gap-6">
        {socialRoute ? <ResponsiveSidebarDrawer /> : null}
        <Link
          href={isAuthenticated ? "/community" : "/"}
          className="flex min-h-11 shrink-0 items-center gap-3 font-extrabold tracking-[-0.02em] text-[#0E3325]"
        >
          <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#347A48] to-[#184B34] text-sm font-black text-white shadow-[0_9px_24px_rgba(24,75,52,0.18)]">
            CP
          </span>
          <span className="hidden text-lg sm:inline xl:text-xl">ConectaPueblos</span>
        </Link>

        {socialRoute ? (
          <form action="/community" className="relative mx-auto hidden w-full max-w-3xl md:block">
            <label className="sr-only" htmlFor="global-search">Buscar publicaciones</label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#60818A]" />
            <input
              className="min-h-11 w-full rounded-full border border-[#184B3418] bg-white/76 py-2 pl-11 pr-4 text-sm text-[#18231D] shadow-sm outline-none transition focus:border-[#347A48] focus:bg-white focus:ring-4 focus:ring-[#347A4818]"
              id="global-search"
              name="q"
              placeholder="Buscar publicaciones..."
              type="search"
            />
          </form>
        ) : (
          <nav className="ml-auto hidden items-center gap-1 text-sm font-bold text-[#435048] md:flex">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                aria-current={isNavigationRoute(pathname, link.href) ? "page" : undefined}
                href={link.href}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full px-4 transition-colors hover:bg-[#184B340a] hover:text-[#184B34]",
                  isNavigationRoute(pathname, link.href) && "bg-white text-[#184B34] shadow-sm",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className={cn("ml-auto flex shrink-0 items-center gap-2", socialRoute && "md:ml-0")}>
          {isAuthenticated ? (
            <Link
              aria-current={isNavigationRoute(pathname, "/messages") ? "page" : undefined}
              aria-label="Mensajes"
              className={cn(
                "hidden size-11 place-items-center rounded-full border border-[#184B3414] bg-white/80 text-[#184B34] transition-colors hover:bg-white lg:grid",
                isNavigationRoute(pathname, "/messages") && "bg-white shadow-sm ring-2 ring-[#347A4818]",
              )}
              href="/messages"
              title="Mensajes"
            >
              <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.8} />
            </Link>
          ) : null}
          {isAuthenticated ? <NotificationBell /> : null}
          {isAuthenticated ? (
            <UserMenu />
          ) : (
            <>
              <Link className="hidden min-h-11 items-center rounded-full px-4 text-sm font-extrabold text-[#184B34] hover:bg-[#184B340a] sm:inline-flex" href="/login">
                Entrar
              </Link>
              <LinkButton href="/register" className="min-h-11 px-4">
                Crear cuenta
              </LinkButton>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
