"use client";

import { Ellipsis, Flag, ShieldAlert } from "lucide-react";
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
import { useTranslations } from "@/components/i18n/i18n-provider";
import { BlockUserDialog } from "@/features/trust/block-user-dialog";
import { ReportContentDialog } from "@/features/trust/report-content-dialog";

export function TrustActionsMenu({
  blockTargetName,
  className,
  contentLabel,
  triggerAriaLabel,
  triggerClassName,
}: {
  blockTargetName?: string;
  className?: string;
  contentLabel: string;
  triggerAriaLabel?: string;
  triggerClassName?: string;
}) {
  const { t } = useTranslations();
  const resolvedTriggerAriaLabel = triggerAriaLabel ?? t("trust.optionsLabel");
  const reactId = useId().replaceAll(":", "");
  const menuId = `trust-menu-${reactId}`;
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [position, setPosition] = useState({ right: 12, top: 80 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const closeReport = useCallback(() => setReportOpen(false), []);
  const closeBlock = useCallback(() => setBlockOpen(false), []);

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
      const items = menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]');
      items?.[event.key === "End" ? items.length - 1 : 0]?.focus();
    }
  }

  function openReport() {
    setMenuOpen(false);
    setReportOpen(true);
  }

  function openBlock() {
    setMenuOpen(false);
    setBlockOpen(true);
  }

  const menuStyle = {
    "--trust-menu-right": `${position.right}px`,
    "--trust-menu-top": `${position.top}px`,
  } as CSSProperties;

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        aria-controls={menuId}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
        aria-label={resolvedTriggerAriaLabel}
        className={
          triggerClassName ??
          "grid size-11 shrink-0 place-items-center rounded-full text-text-muted transition-colors hover:bg-[#184B340a] hover:text-primary"
        }
        type="button"
        onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
        onKeyDown={handleTriggerKeyDown}
      >
        <Ellipsis aria-hidden="true" className="size-5" />
      </button>

      {menuOpen && typeof document !== "undefined" ? createPortal(
        <div className="fixed inset-0 z-[140] isolate" onPointerDown={() => setMenuOpen(false)}>
          <div
            ref={menuRef}
            aria-label={t("trust.optionsLabel")}
            className="absolute inset-x-3 bottom-[max(1rem,env(safe-area-inset-bottom))] rounded-[20px] border border-[#184B3417] bg-ivory p-2 text-text-primary shadow-[0_22px_64px_rgba(14,51,37,0.18)] outline-none sm:inset-x-auto sm:bottom-auto sm:right-[var(--trust-menu-right)] sm:top-[var(--trust-menu-top)] sm:w-60"
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
              onClick={openReport}
            >
              <span className="grid size-9 place-items-center rounded-full bg-[#C96D4A14]">
                <Flag aria-hidden="true" className="size-4" />
              </span>
              {t("trust.reportAction")}
            </button>
            {blockTargetName ? (
              <button
                className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-left text-sm font-extrabold text-text-primary transition-colors hover:bg-[#184B340a]"
                role="menuitem"
                tabIndex={-1}
                type="button"
                onClick={openBlock}
              >
                <span className="grid size-9 place-items-center rounded-full bg-[#184B340a]">
                  <ShieldAlert aria-hidden="true" className="size-4" />
                </span>
                {t("trust.blockAction", { name: blockTargetName })}
              </button>
            ) : null}
          </div>
        </div>,
        document.body,
      ) : null}

      <ReportContentDialog
        contentLabel={contentLabel}
        open={reportOpen}
        triggerRef={triggerRef}
        onClose={closeReport}
      />
      {blockTargetName ? (
        <BlockUserDialog
          open={blockOpen}
          targetName={blockTargetName}
          triggerRef={triggerRef}
          onClose={closeBlock}
        />
      ) : null}
    </div>
  );
}
