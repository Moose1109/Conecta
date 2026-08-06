"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, Settings, ShieldCheck, UserRound } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { UserAvatar } from "@/components/social/user-avatar";
import { isAdminUser } from "@/features/auth/roles";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { clearSession } from "@/lib/api/session";
import type { TranslationKey } from "@/lib/i18n/types";
import { cn } from "@/lib/utils";

const accountLinks: Array<{
  href: string;
  icon: typeof UserRound;
  labelKey: TranslationKey;
  metaKey: TranslationKey;
}> = [
  { href: "/profile", icon: UserRound, labelKey: "userMenu.profile.label", metaKey: "userMenu.profile.meta" },
  { href: "/notifications", icon: Bell, labelKey: "userMenu.notifications.label", metaKey: "userMenu.notifications.meta" },
  { href: "/settings", icon: Settings, labelKey: "userMenu.editProfile.label", metaKey: "userMenu.editProfile.meta" },
];

const menuId = "account-menu";

export function UserMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthSession();
  const { t } = useTranslations();
  const [open, setOpen] = useState(false);
  const triggerWrapperRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const initialItemRef = useRef<"first" | "last">("first");
  const name = user?.name ?? user?.username ?? t("userMenu.defaultName");
  const displayName = user?.username ?? user?.name ?? t("userMenu.defaultAccountLabel");

  function getMenuItems() {
    return Array.from(
      menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [],
    );
  }

  function openMenu(initialItem: "first" | "last" = "first") {
    initialItemRef.current = initialItem;
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const previousOverflow = document.body.style.overflow;
    if (isMobile) document.body.style.overflow = "hidden";

    const animationFrame = window.requestAnimationFrame(() => {
      const items = getMenuItems();
      const item = initialItemRef.current === "last" ? items.at(-1) : items[0];
      item?.focus();
    });

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (
        !menuRef.current?.contains(target) &&
        !triggerWrapperRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      if (isMobile) document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(event.key === "ArrowUp" ? "last" : "first");
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const items = getMenuItems();
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);

    if (event.key === "Tab") {
      setOpen(false);
      return;
    }

    let nextIndex: number | null = null;
    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % items.length;
    if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + items.length) % items.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = items.length - 1;

    if (nextIndex !== null && items[nextIndex]) {
      event.preventDefault();
      items[nextIndex].focus();
    }
  }

  function handleLogout() {
    setOpen(false);
    clearSession();
    router.refresh();
    router.push("/");
  }

  function active(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  const menu = open && typeof document !== "undefined" ? createPortal(
    <div className="fixed inset-0 z-[100] isolate">
      <div aria-hidden="true" className="absolute inset-0 bg-[#0E3325]/18 backdrop-blur-[1px] sm:bg-transparent sm:backdrop-blur-none" />
      <div
        ref={menuRef}
        aria-labelledby="account-menu-button"
        className="absolute inset-x-3 bottom-[max(1rem,env(safe-area-inset-bottom))] max-h-[calc(100dvh-2rem-env(safe-area-inset-bottom))] touch-pan-y overflow-y-auto overscroll-contain rounded-[24px] border border-[#184B3417] bg-[#FFFCF7] p-2 text-[#18231D] shadow-[0_26px_80px_rgba(14,51,37,0.2)] outline-none sm:bottom-auto sm:left-auto sm:right-5 sm:top-[84px] sm:w-80 xl:right-[max(2.25rem,calc((100vw-1500px)/2))]"
        id={menuId}
        role="menu"
        onKeyDown={handleMenuKeyDown}
      >
        <div className="flex gap-3 border-b border-[#184B3414] p-3" role="presentation">
          <UserAvatar className="size-12 text-sm ring-0" imageUrl={user?.avatarUrl} name={name} />
          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold">{name}</p>
            <p className="mt-1 truncate text-xs font-medium text-[#687269]">{user?.email ?? t("userMenu.defaultEmail")}</p>
          </div>
        </div>

        <div className="py-2" role="presentation">
          {accountLinks.map(({ href, icon: Icon, labelKey, metaKey }) => (
            <Link
              key={href}
              href={href}
              aria-current={active(href) ? "page" : undefined}
              className={cn("flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 transition-colors hover:bg-[#184B3408]", active(href) && "bg-[#184B340a] text-[#184B34]")}
              role="menuitem"
              tabIndex={-1}
              onClick={() => setOpen(false)}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#184B340a] text-[#347A48]"><Icon aria-hidden="true" className="size-4" /></span>
              <span><span className="block text-sm font-extrabold">{t(labelKey)}</span><span className="mt-0.5 block text-[11px] font-medium text-[#687269]">{t(metaKey)}</span></span>
            </Link>
          ))}
        </div>

        {isAdminUser(user) ? (
          <div className="border-t border-[#184B3414] py-2" role="presentation">
            <Link
              href="/admin"
              aria-current={active("/admin") ? "page" : undefined}
              className={cn("flex min-h-11 items-center gap-3 rounded-2xl px-3 py-2.5 hover:bg-[#184B3408]", active("/admin") && "bg-[#184B340a] text-[#184B34]")}
              role="menuitem"
              tabIndex={-1}
              onClick={() => setOpen(false)}
            >
              <span className="grid size-9 place-items-center rounded-full bg-[#D7A63C24] text-[#184B34]"><ShieldCheck aria-hidden="true" className="size-4" /></span>
              <span className="text-sm font-extrabold">{t("userMenu.adminPanel")}</span>
            </Link>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-2 border-t border-[#184B3414] px-3 py-2.5" role="presentation">
          <span className="text-sm font-extrabold text-[#18231D]">{t("languageSwitcher.label")}</span>
          <LanguageSwitcher />
        </div>

        <div className="border-t border-[#184B3414] pt-2" role="presentation">
          <button className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-extrabold text-[#A95539] hover:bg-[#C96D4A0d]" role="menuitem" tabIndex={-1} type="button" onClick={handleLogout}>
            <LogOut aria-hidden="true" className="size-4" /> {t("userMenu.logout")}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <div ref={triggerWrapperRef} className="relative">
      <button
        ref={buttonRef}
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex min-h-11 items-center gap-2 rounded-full border border-[#184B3414] bg-white/80 py-1 pl-1 pr-2.5 text-sm font-extrabold text-[#184B34] shadow-sm transition-colors hover:bg-white"
        id="account-menu-button"
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <UserAvatar className="size-9 text-xs ring-0" imageUrl={user?.avatarUrl} name={name} />
        <span className="hidden max-w-28 truncate sm:block">{displayName}</span>
        <ChevronDown aria-hidden="true" className={cn("size-4 transition-transform", open && "rotate-180")} />
      </button>
      {menu}
    </div>
  );
}
