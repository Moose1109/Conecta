"use client";

import { Ellipsis, Flag, X } from "lucide-react";
import {
  type CSSProperties,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { useModalDialog } from "@/components/ui/use-modal-dialog";

export function PostTrustMenu() {
  const reactId = useId().replaceAll(":", "");
  const menuId = `post-menu-${reactId}`;
  const dialogId = `report-dialog-${reactId}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingOpen, setPendingOpen] = useState(false);
  const [position, setPosition] = useState({ right: 12, top: 80 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closePending = useCallback(() => setPendingOpen(false), []);

  useModalDialog({
    dialogRef,
    onClose: closePending,
    open: pendingOpen,
    triggerRef,
  });

  function openMenu() {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      setPosition({
        right: Math.max(12, window.innerWidth - rect.right),
        top: Math.min(rect.bottom + 8, window.innerHeight - 112),
      });
    }
    setMenuOpen(true);
  }

  useEffect(() => {
    if (!menuOpen) return;

    const animationFrame = window.requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    });

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    }

    function closeOnViewportChange() {
      setMenuOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", closeOnViewportChange);
    window.addEventListener("scroll", closeOnViewportChange, true);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", closeOnViewportChange);
      window.removeEventListener("scroll", closeOnViewportChange, true);
    };
  }, [menuOpen]);

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu();
    }
  }

  function handleMenuKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      setMenuOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      menuRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
    }
  }

  function showPendingNotice() {
    setMenuOpen(false);
    setPendingOpen(true);
  }

  const menuStyle = {
    "--post-menu-right": `${position.right}px`,
    "--post-menu-top": `${position.top}px`,
  } as CSSProperties;

  return (
    <>
      <button
        ref={triggerRef}
        aria-controls={menuId}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label="Opciones de la publicación"
        className="grid size-11 shrink-0 place-items-center rounded-full text-text-muted transition-colors hover:bg-[#184B340a] hover:text-primary"
        type="button"
        onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <Ellipsis aria-hidden="true" className="size-5" />
      </button>

      {menuOpen && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[90] isolate" onPointerDown={() => setMenuOpen(false)}>
          <div
            ref={menuRef}
            aria-label="Opciones de confianza"
            className="absolute inset-x-3 bottom-[max(1rem,env(safe-area-inset-bottom))] rounded-[20px] border border-[#184B3417] bg-ivory p-2 text-text-primary shadow-[0_22px_64px_rgba(14,51,37,0.18)] outline-none sm:inset-x-auto sm:bottom-auto sm:right-[var(--post-menu-right)] sm:top-[var(--post-menu-top)] sm:w-56"
            id={menuId}
            role="menu"
            style={menuStyle}
            onKeyDown={handleMenuKeyDown}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <button
              className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-extrabold text-danger transition-colors hover:bg-[#C96D4A0d]"
              role="menuitem"
              tabIndex={-1}
              type="button"
              onClick={showPendingNotice}
            >
              <span className="grid size-9 place-items-center rounded-full bg-[#C96D4A14]">
                <Flag aria-hidden="true" className="size-4" />
              </span>
              Reportar
            </button>
          </div>
        </div>,
        document.body,
      ) : null}

      {pendingOpen && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[110] isolate">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-forest-deep/34 backdrop-blur-[2px]"
            onPointerDown={closePending}
          />
          <div
            ref={dialogRef}
            aria-label="Reporte pendiente de backend"
            aria-modal="true"
            className="absolute inset-x-3 top-1/2 mx-auto max-w-lg -translate-y-1/2 rounded-[26px] border border-[#184B3417] bg-ivory p-3 shadow-[0_28px_90px_rgba(14,51,37,0.22)] outline-none sm:p-4"
            id={dialogId}
            role="dialog"
            tabIndex={-1}
          >
            <div className="mb-2 flex justify-end">
              <button
                aria-label="Cerrar aviso"
                className="grid size-11 place-items-center rounded-full bg-[#184B340a] text-primary"
                data-dialog-initial-focus
                type="button"
                onClick={closePending}
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <BackendPendingAlert
              description="Esta publicación no se ha reportado. El backend todavía no ofrece el envío ni el seguimiento de reportes."
              title="Reporte pendiente de backend"
            />
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
