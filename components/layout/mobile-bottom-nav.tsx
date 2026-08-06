"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "@/components/i18n/i18n-provider";
import {
  primaryNavigationItems,
  profileNavigationItem,
} from "@/components/layout/navigation-items";
import { isNavigationRoute, isSocialRoute } from "@/components/layout/social-routes";
import { cn } from "@/lib/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useTranslations();
  const socialRoute = isSocialRoute(pathname);

  if (!socialRoute) {
    return null;
  }

  const items = [...primaryNavigationItems, profileNavigationItem];

  return (
    <nav
      aria-label={t("navigation.mobileNavLabel")}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#184B3417] bg-[#FFFCF7]/96 px-2 pb-[max(0.45rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-12px_32px_rgba(24,75,52,0.1)] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-4 gap-1">
        {items.map((item) => {
          const active = isNavigationRoute(pathname, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              aria-current={active ? "page" : undefined}
              href={item.href}
              className={cn(
                "flex min-h-[58px] flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[10px] font-extrabold transition-colors",
                active ? "bg-[#184B34] text-white" : "text-[#687269] hover:bg-[#184B340a] hover:text-[#184B34]",
              )}
            >
              <Icon aria-hidden="true" className="size-5" strokeWidth={active ? 2.2 : 1.8} />
              <span>{t(item.mobileLabelKey ?? item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
