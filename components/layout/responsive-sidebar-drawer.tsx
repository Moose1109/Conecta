"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  primaryNavigationItems,
  profileNavigationItem,
} from "@/components/layout/navigation-items";
import { AuthIcon } from "@/features/auth/auth-icons";
import { cn } from "@/lib/utils";

const drawerId = "responsive-sidebar-drawer";

export function ResponsiveSidebarDrawer() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const items = [...primaryNavigationItems, profileNavigationItem];

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (buttonRef.current?.contains(target) || drawerRef.current?.contains(target)) {
        return;
      }

      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      drawerRef.current?.focus();
    }
  }, [open]);

  function isActive(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  function closeDrawer() {
    setOpen(false);
  }

  return (
    <div className="relative hidden md:block lg:hidden">
      <button
        ref={buttonRef}
        aria-controls={drawerId}
        aria-expanded={open}
        aria-label={open ? "Cerrar navegación" : "Abrir navegación"}
        className="grid size-10 place-items-center rounded-full bg-white/80 text-[#1F3D2B] transition-colors hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#3A7D4424]"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="grid gap-1" aria-hidden="true">
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
          <span className="block h-0.5 w-5 rounded-full bg-current" />
        </span>
      </button>

      {open ? (
        <>
          <button
            aria-label="Cerrar navegación"
            className="fixed inset-0 z-40 bg-[#1F3D2B]/22 md:hidden"
            type="button"
            onClick={closeDrawer}
          />
          <div
            ref={drawerRef}
            aria-label="Menú de navegación"
            className="fixed inset-x-0 bottom-0 z-50 max-h-[78vh] overflow-hidden rounded-t-[28px] border border-[#1F3D2B14] bg-[#FAF7F0] p-4 text-[#1F3D2B] shadow-[0_-24px_80px_rgba(31,61,43,0.22)] outline-none md:absolute md:inset-x-auto md:bottom-auto md:left-0 md:top-[calc(100%+0.75rem)] md:max-h-[min(72vh,520px)] md:w-[360px] md:rounded-3xl md:bg-[#FFFDF8] md:shadow-[0_28px_90px_rgba(31,61,43,0.22)]"
            id={drawerId}
            role="dialog"
            tabIndex={-1}
          >
            <div className="flex items-center justify-between gap-3 border-b border-[#1F3D2B12] pb-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3A7D44]">
                  Atajos
                </p>
                <p className="mt-1 text-xl font-black">Menú rápido</p>
              </div>
              <button
                aria-label="Cerrar navegación"
                className="grid size-10 place-items-center rounded-full bg-white/78 text-[#1F3D2B]/70 transition-colors hover:bg-white hover:text-[#1F3D2B]"
                type="button"
                onClick={closeDrawer}
              >
                <CloseIcon className="size-5" />
              </button>
            </div>

            <nav
              aria-label="Atajos de la app"
              className="mt-4 grid max-h-[calc(78vh-7rem)] gap-2 overflow-y-auto md:max-h-[400px]"
            >
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex min-h-16 items-center gap-3 rounded-2xl px-3 py-3 text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]",
                    isActive(item.href)
                      ? "bg-[#3A7D44] text-white shadow-[0_14px_32px_rgba(58,125,68,0.22)]"
                      : "bg-white/54 text-[#1F3D2B]/72 hover:bg-white hover:text-[#1F3D2B]",
                  )}
                  onClick={closeDrawer}
                >
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-2xl bg-[#1F3D2B0d] text-[#3A7D44]",
                      isActive(item.href) && "bg-white/16 text-white",
                    )}
                  >
                    <AuthIcon className="size-5" name={item.icon} />
                  </span>
                  <span className="min-w-0">
                    <span className="block">{item.label}</span>
                    <span
                      className={cn(
                        "mt-0.5 block text-xs font-bold leading-5 text-[#1E1E1E]/52",
                        isActive(item.href) && "text-white/72",
                      )}
                    >
                      {item.meta}
                    </span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </>
      ) : null}
    </div>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
