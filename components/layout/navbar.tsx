"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, MessageCircle, Search } from "lucide-react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { ResponsiveSidebarDrawer } from "@/components/layout/responsive-sidebar-drawer";
import { isNavigationRoute } from "@/components/layout/social-routes";
import { UserMenu } from "@/components/layout/user-menu";
import { NotificationBell } from "@/components/ui/notification-bell";
import { LinkButton } from "@/components/ui/button";
import { buildAuthHref } from "@/features/auth/next-path";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { token, status } = useAuthSession();
  const { t } = useTranslations();
  const isAuthenticated = Boolean(token);

  if (!isAuthenticated) {
    return (
      <header className="sticky top-0 z-40 border-b border-[#184B3412] bg-[#F7F2E8]/92 backdrop-blur-xl">
        <div className="page-shell flex min-h-[72px] items-center gap-2 sm:gap-3">
          <Link
            aria-label={t("navigation.public.backAriaLabel")}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-[#184B3414] bg-white/80 text-[#184B34] transition-colors hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#184B34] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F2E8]"
            href="/"
          >
            <ArrowLeft aria-hidden="true" className="size-5" strokeWidth={1.8} />
          </Link>
          <Link
            href="/"
            className="flex min-h-11 shrink-0 items-center gap-2.5 font-extrabold tracking-[-0.02em] text-[#0E3325] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#184B34] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F2E8]"
          >
            <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#347A48] to-[#184B34] text-sm font-black text-white shadow-[0_9px_24px_rgba(24,75,52,0.18)]">
              CP
            </span>
            <span className="hidden text-lg sm:inline xl:text-xl">ConectaPueblos</span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <LanguageSwitcher showLabel={false} />
            <Link
              className="inline-flex min-h-11 items-center rounded-full px-4 text-sm font-extrabold text-[#184B34] hover:bg-[#184B340a]"
              href={buildAuthHref("/login", pathname)}
            >
              {t("auth.signIn")}
            </Link>
            <div className="hidden sm:block">
              <LinkButton
                href={buildAuthHref("/register", pathname)}
                className="min-h-11 px-4"
              >
                {t("auth.createAccount")}
              </LinkButton>
            </div>
          </div>
        </div>
      </header>
    );
  }

  const isConfirmed = status === "verified";

  return (
    <header className="sticky top-0 z-40 border-b border-[#184B3412] bg-[#F7F2E8]/92 backdrop-blur-xl">
      <div className="page-shell flex min-h-[72px] items-center gap-3 lg:gap-6">
        {isConfirmed ? (
          <ResponsiveSidebarDrawer />
        ) : (
          <span
            aria-hidden="true"
            className="block size-11 shrink-0 rounded-full border border-[#184B3414] bg-white/80"
          />
        )}
        <Link
          href="/community"
          className="flex min-h-11 shrink-0 items-center gap-3 font-extrabold tracking-[-0.02em] text-[#0E3325]"
        >
          <span className="grid size-10 place-items-center rounded-2xl bg-gradient-to-br from-[#347A48] to-[#184B34] text-sm font-black text-white shadow-[0_9px_24px_rgba(24,75,52,0.18)]">
            CP
          </span>
          <span className="hidden text-lg sm:inline xl:text-xl">ConectaPueblos</span>
        </Link>

        {isConfirmed ? (
          <form action="/community" className="relative mx-auto hidden w-full max-w-3xl md:block">
            <label className="sr-only" htmlFor="global-search">{t("navigation.searchLabel")}</label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#60818A]" />
            <input
              className="min-h-11 w-full rounded-full border border-[#184B3418] bg-white/76 py-2 pl-11 pr-4 text-sm text-[#18231D] shadow-sm outline-none transition focus:border-[#347A48] focus:bg-white focus:ring-4 focus:ring-[#184B34] focus:ring-offset-2 focus:ring-offset-[#F7F2E8]"
              id="global-search"
              name="q"
              placeholder={t("navigation.searchPlaceholder")}
              type="search"
            />
          </form>
        ) : (
          <span aria-hidden="true" className="mx-auto hidden h-11 w-full max-w-3xl animate-pulse rounded-full bg-[#184B340a] md:block" />
        )}

        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          {isConfirmed ? (
            <>
              <Link
                aria-label={t("navigation.searchLabel")}
                className="grid size-11 place-items-center rounded-full border border-[#184B3414] bg-white/80 text-[#184B34] transition-colors hover:bg-white md:hidden"
                href="/community#community-search"
                title={t("navigation.searchLabel")}
              >
                <Search aria-hidden="true" className="size-5" strokeWidth={1.8} />
              </Link>
              <Link
                aria-current={isNavigationRoute(pathname, "/messages") ? "page" : undefined}
                aria-label={t("navigation.messages.label")}
                className={cn(
                  "hidden size-11 place-items-center rounded-full border border-[#184B3414] bg-white/80 text-[#184B34] transition-colors hover:bg-white lg:grid",
                  isNavigationRoute(pathname, "/messages") && "bg-white shadow-sm ring-2 ring-[#347A4818]",
                )}
                href="/messages"
                title={t("navigation.messages.label")}
              >
                <MessageCircle aria-hidden="true" className="size-5" strokeWidth={1.8} />
              </Link>
              <NotificationBell />
              <UserMenu />
            </>
          ) : (
            <div
              aria-hidden="true"
              className="flex min-h-11 items-center gap-2 rounded-full border border-[#184B3414] bg-white/80 py-1 pl-1 pr-2.5"
            >
              <span className="size-9 shrink-0 animate-pulse rounded-full bg-[#184B340f]" />
              <span className="hidden h-3 w-16 animate-pulse rounded-full bg-[#184B340f] sm:block" />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
