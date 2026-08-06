"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine } from "lucide-react";
import { useTranslations } from "@/components/i18n/i18n-provider";
import {
  primaryNavigationItems,
  secondaryNavigationItems,
} from "@/components/layout/navigation-items";
import { isNavigationRoute } from "@/components/layout/social-routes";
import { Card } from "@/components/ui/card";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { cn } from "@/lib/utils";

export function SidebarNav() {
  const pathname = usePathname();
  const { token } = useAuthSession();
  const { t } = useTranslations();

  return (
    <div className="grid gap-4 lg:sticky lg:top-[92px]">
      <Card className="overflow-hidden p-3">
        <p className="eyebrow px-2 pb-2 pt-1">{t("navigation.exploreSection")}</p>
        <nav aria-label={t("navigation.socialNavLabel")} className="grid gap-1.5">
          {primaryNavigationItems.map((link) => {
            const active = isNavigationRoute(pathname, link.href);
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                aria-current={active ? "page" : undefined}
                href={link.href}
                className={cn(
                  "group flex min-h-[66px] items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all duration-200 hover:bg-[#184B340a]",
                  active && "bg-gradient-to-br from-[#347A48] to-[#28663C] text-white shadow-[0_12px_28px_rgba(24,75,52,0.2)] hover:bg-[#347A48]",
                )}
              >
                <span className={cn("grid size-10 shrink-0 place-items-center rounded-full bg-[#184B340a] text-[#347A48]", active && "bg-white/14 text-white")}>
                  <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                </span>
                <span className="min-w-0">
                  <span className="block font-extrabold">{t(link.labelKey)}</span>
                  <span className={cn("mt-0.5 block text-[11px] font-semibold leading-4 text-[#687269]", active && "text-white/72")}>{t(link.metaKey)}</span>
                </span>
              </Link>
            );
          })}
        </nav>

        {token ? (
          <>
            <div className="mx-2 my-3 h-px bg-[#184B3414]" />
            <p className="eyebrow px-2 pb-2">{t("navigation.mySpaceSection")}</p>
            <nav aria-label={t("navigation.personalNavLabel")} className="grid gap-1">
              {secondaryNavigationItems.map((link) => {
                const active = isNavigationRoute(pathname, link.href);
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    aria-current={active ? "page" : undefined}
                    href={link.href}
                    className={cn(
                      "flex min-h-12 items-center gap-3 rounded-xl px-3 py-2 text-sm font-bold text-[#435048] transition-colors hover:bg-[#184B340a] hover:text-[#184B34]",
                      active && "bg-[#184B340d] text-[#184B34]",
                    )}
                  >
                    <Icon aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
                    {t(link.labelKey)}
                  </Link>
                );
              })}
            </nav>
          </>
        ) : null}
      </Card>

      <Card className="relative overflow-hidden border-0 bg-[#0E3325] p-5 text-white shadow-[0_18px_48px_rgba(14,51,37,0.2)]">
        <Image
          alt=""
          aria-hidden="true"
          className="object-cover opacity-25"
          fill
          loading="eager"
          sizes="248px"
          src="/images/raiz-village-hero.webp"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E3325]/70 via-[#0E3325]/88 to-[#0E3325]" />
        <div className="relative">
          <p className="font-editorial text-2xl font-semibold leading-7">{t("navigation.sidebarPromo.title")}</p>
          <p className="mt-3 text-xs font-medium leading-5 text-white/72">{t("navigation.sidebarPromo.description")}</p>
          <Link
            className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-extrabold text-[#184B34] transition-transform hover:-translate-y-0.5"
            href="/community#publicar"
          >
            <PenLine aria-hidden="true" className="size-4" />
            {t("navigation.sidebarPromo.cta")}
          </Link>
        </div>
      </Card>
    </div>
  );
}
