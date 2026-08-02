"use client";

import type { RefObject } from "react";
import { useEffect, useRef } from "react";

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "details > summary:first-of-type",
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(",");

let openDialogCount = 0;
let bodyOverflowBeforeDialogs = "";
const dialogStack: HTMLElement[] = [];

type ModalDialogOptions = {
  dialogRef: RefObject<HTMLElement | null>;
  open: boolean;
  onClose: () => void;
  triggerRef?: RefObject<HTMLElement | null>;
};

export function useModalDialog({ dialogRef, open, onClose, triggerRef }: ModalDialogOptions) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;

    const dialog = dialogRef.current;
    const trigger = triggerRef?.current;
    const previouslyFocused = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;

    if (openDialogCount === 0) {
      bodyOverflowBeforeDialogs = document.body.style.overflow;
    }
    openDialogCount += 1;
    document.body.style.overflow = "hidden";
    if (dialog) dialogStack.push(dialog);

    function isTopmostDialog() {
      return !dialog || dialogStack[dialogStack.length - 1] === dialog;
    }

    function getFocusableElements() {
      if (!dialog) return [];

      return Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
        (element) =>
          !element.hasAttribute("hidden") &&
          element.getAttribute("aria-hidden") !== "true" &&
          element.getAttribute("aria-disabled") !== "true" &&
          element.getClientRects().length > 0,
      );
    }

    function focusFirstElement() {
      const initialFocus = dialog?.querySelector<HTMLElement>("[data-dialog-initial-focus]");
      (initialFocus ?? getFocusableElements()[0] ?? dialog)?.focus();
    }

    const animationFrame = window.requestAnimationFrame(() => {
      focusFirstElement();
    });

    function handleKeyDown(event: KeyboardEvent) {
      if (!isTopmostDialog()) return;

      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== "Tab" || !dialog) return;

      const focusableElements = getFocusableElements();

      if (focusableElements.length === 0) {
        event.preventDefault();
        dialog.focus();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (
        event.shiftKey &&
        (activeElement === dialog || activeElement === firstElement || !dialog.contains(activeElement))
      ) {
        event.preventDefault();
        lastElement.focus();
      } else if (
        !event.shiftKey &&
        (activeElement === lastElement || !dialog.contains(activeElement))
      ) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    function handleFocusIn(event: FocusEvent) {
      if (!isTopmostDialog()) return;
      if (dialog && !dialog.contains(event.target as Node)) {
        focusFirstElement();
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("focusin", handleFocusIn);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("focusin", handleFocusIn);

      if (dialog) {
        const stackIndex = dialogStack.indexOf(dialog);
        if (stackIndex !== -1) dialogStack.splice(stackIndex, 1);
      }

      openDialogCount = Math.max(0, openDialogCount - 1);
      if (openDialogCount === 0) {
        document.body.style.overflow = bodyOverflowBeforeDialogs;
      }

      const focusTarget = trigger?.isConnected ? trigger : previouslyFocused;
      window.requestAnimationFrame(() => {
        if (focusTarget?.isConnected) focusTarget.focus();
      });
    };
  }, [dialogRef, open, triggerRef]);
}
