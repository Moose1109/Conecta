"use client";

import { Check, Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useId,
  useRef,
  useState,
  useTransition,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { SUPPORTED_LOCALES, localeNativeName, type Locale } from "@/lib/i18n/config";
import { setLocaleAction } from "@/lib/i18n/set-locale-action";
import { cn } from "@/lib/utils";

const MENU_WIDTH = 208;

export function LanguageSwitcher({
  className,
  showLabel = true,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { locale, t } = useTranslations();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();
  const reactId = useId().replaceAll(":", "");
  const menuId = `language-switcher-${reactId}`;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 12, top: 80 });

  function getItems() {
    return Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitemradio"]') ?? []);
  }

  function openMenu() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        left: Math.min(rect.left, window.innerWidth - MENU_WIDTH - 12),
        top: Math.min(rect.bottom + 8, window.innerHeight - 112),
      });
    }
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;

    const animationFrame = window.requestAnimationFrame(() => {
      (menuRef.current?.querySelector<HTMLElement>('[aria-checked="true"]') ?? getItems()[0])?.focus();
    });

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (!menuRef.current?.contains(target) && !triggerRef.current?.contains(target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const items = getItems();
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

  function selectLocale(nextLocale: Locale) {
    setOpen(false);
    triggerRef.current?.focus();
    if (nextLocale === locale) return;

    startTransition(() => {
      void setLocaleAction(nextLocale).then(() => {
        router.refresh();
      });
    });
  }

  const menuStyle = {
    "--language-switcher-left": `${position.left}px`,
    "--language-switcher-top": `${position.top}px`,
  } as CSSProperties;

  const menu = open && typeof document !== "undefined" ? createPortal(
    <div className="fixed inset-0 z-[140] isolate" onPointerDown={() => setOpen(false)}>
      <div
        ref={menuRef}
        aria-label={t("languageSwitcher.changeLanguage")}
        className="absolute inset-x-3 bottom-[max(1rem,env(safe-area-inset-bottom))] rounded-[20px] border border-[#184B3417] bg-[#FFFCF7] p-2 text-[#18231D] shadow-[0_22px_64px_rgba(14,51,37,0.18)] outline-none sm:inset-x-auto sm:bottom-auto sm:left-[var(--language-switcher-left)] sm:top-[var(--language-switcher-top)] sm:w-52"
        id={menuId}
        role="menu"
        style={menuStyle}
        onKeyDown={handleMenuKeyDown}
        onPointerDown={(event) => event.stopPropagation()}
      >
        {SUPPORTED_LOCALES.map((item) => {
          const selected = item === locale;

          return (
            <button
              key={item}
              aria-checked={selected}
              className={cn(
                "flex min-h-11 w-full items-center justify-between gap-3 rounded-2xl px-3 text-left text-sm font-extrabold transition-colors hover:bg-[#184B3408]",
                selected ? "text-[#184B34]" : "text-[#435048]",
              )}
              role="menuitemradio"
              tabIndex={-1}
              type="button"
              onClick={() => selectLocale(item)}
            >
              {localeNativeName[item]}
              {selected ? <Check aria-hidden="true" className="size-4 shrink-0" /> : null}
            </button>
          );
        })}
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        aria-controls={menuId}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t("languageSwitcher.changeLanguage")}
        className="flex min-h-11 items-center gap-2 rounded-full border border-[#184B3414] bg-white/80 px-3 text-sm font-extrabold text-[#184B34] shadow-sm transition-colors hover:bg-white"
        type="button"
        onClick={() => (open ? setOpen(false) : openMenu())}
      >
        <Languages aria-hidden="true" className="size-4 shrink-0" strokeWidth={1.8} />
        {showLabel ? <span>{localeNativeName[locale]}</span> : null}
      </button>
      {menu}
    </div>
  );
}
