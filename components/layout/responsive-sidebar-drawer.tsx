"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "@/components/i18n/i18n-provider";
import {
  primaryNavigationItems,
  secondaryNavigationItems,
} from "@/components/layout/navigation-items";
import { isNavigationRoute } from "@/components/layout/social-routes";
import { useModalDialog } from "@/components/ui/use-modal-dialog";
import { cn } from "@/lib/utils";

const drawerId = "responsive-sidebar-drawer";

export function ResponsiveSidebarDrawer() {
  const pathname = usePathname();
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const closeDrawer = useCallback(() => setOpen(false), []);

  useModalDialog({
    dialogRef: drawerRef,
    onClose: closeDrawer,
    open,
    triggerRef: buttonRef,
  });

  function NavLink({
    item,
    primary = false,
  }: {
    item: (typeof primaryNavigationItems)[number] | (typeof secondaryNavigationItems)[number];
    primary?: boolean;
  }) {
    const Icon = item.icon;
    const selected = isNavigationRoute(pathname, item.href);

    return (
      <Link
        href={item.href}
        aria-current={selected ? "page" : undefined}
        className={cn(
          "min-h-14 items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-extrabold transition-colors",
          primary || item.href === "/profile" ? "hidden md:flex" : "flex",
          selected ? "bg-[#184B34] text-white" : "bg-white/58 text-[#435048] hover:bg-white hover:text-[#184B34]",
        )}
        onClick={closeDrawer}
      >
        <span className={cn("grid size-10 place-items-center rounded-full bg-[#184B340a] text-[#347A48]", selected && "bg-white/14 text-white")}>
          <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
        </span>
        <span>
          <span className="block">{t(item.labelKey)}</span>
          <span className={cn("mt-0.5 block text-[11px] font-semibold text-[#677168]", selected && "text-white/70")}>{t(item.metaKey)}</span>
        </span>
      </Link>
    );
  }

  return (
    <div className="relative block lg:hidden">
      <button
        ref={buttonRef}
        aria-controls={drawerId}
        aria-expanded={open}
        aria-label={open ? t("navigation.closeDrawer") : t("navigation.openDrawer")}
        className="grid size-11 place-items-center rounded-full border border-[#184B3414] bg-white/80 text-[#184B34] transition-colors hover:bg-white"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
      </button>

      {open && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[100] isolate">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[#0E3325]/34 backdrop-blur-[2px] sm:bg-[#0E3325]/20"
            onPointerDown={closeDrawer}
          />
          <div
            ref={drawerRef}
            aria-labelledby="responsive-sidebar-title"
            aria-modal="true"
            className="absolute inset-x-0 bottom-0 z-10 max-h-[calc(82dvh-env(safe-area-inset-bottom))] touch-pan-y overflow-y-auto overscroll-contain rounded-t-[30px] border border-[#184B3417] bg-[#F7F2E8] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-24px_80px_rgba(14,51,37,0.22)] outline-none sm:bottom-auto sm:left-5 sm:right-auto sm:top-[84px] sm:max-h-[min(76dvh,620px)] sm:w-[370px] sm:rounded-[26px] sm:bg-[#FFFCF7] sm:pb-4 sm:shadow-[0_28px_90px_rgba(14,51,37,0.2)] xl:left-[max(2.25rem,calc((100vw-1500px)/2))]"
            id={drawerId}
            role="dialog"
            tabIndex={-1}
          >
            <div className="flex items-center justify-between border-b border-[#184B3414] px-1 pb-4">
              <div>
                <p className="eyebrow">{t("navigation.drawerEyebrow")}</p>
                <h2 className="mt-1 text-xl font-extrabold text-[#18231D]" id="responsive-sidebar-title">ConectaPueblos</h2>
              </div>
              <button
                aria-label={t("navigation.closeDrawer")}
                data-dialog-initial-focus
                className="grid size-11 place-items-center rounded-full bg-[#184B340a] text-[#184B34]"
                type="button"
                onClick={closeDrawer}
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <nav className="mt-4 grid gap-2" aria-label={t("navigation.appSections")}>
              {primaryNavigationItems.map((item) => <NavLink item={item} key={item.href} primary />)}
              <div className="hidden h-px bg-[#184B3414] sm:block" />
              {secondaryNavigationItems.map((item) => <NavLink item={item} key={item.href} />)}
            </nav>
          </div>
        </div>,
        document.body,
      ) : null}
    </div>
  );
}
