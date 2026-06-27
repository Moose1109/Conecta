"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function JoinActivityButton({
  className,
  compact = false,
  storageKey,
}: {
  className?: string;
  compact?: boolean;
  storageKey?: string;
}) {
  const localKey = storageKey ? `cp:activity:${storageKey}:joined` : undefined;
  const [joined, setJoined] = useState(() => {
    if (typeof window === "undefined" || !localKey) {
      return false;
    }

    return window.localStorage.getItem(localKey) === "true";
  });

  function toggleJoined() {
    setJoined((value) => {
      const next = !value;
      if (localKey) {
        window.localStorage.setItem(localKey, String(next));
      }
      return next;
    });
  }

  return (
    <button
      aria-pressed={joined}
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-[#3A7D4424]",
        joined
          ? "bg-[#D9A441] text-[#1F3D2B] hover:bg-[#cf9935]"
          : "bg-[#3A7D44] text-white hover:bg-[#2f6738]",
        compact && "min-h-9 px-4 text-xs",
        className,
      )}
      type="button"
      onClick={(event) => {
        event.preventDefault();
        toggleJoined();
      }}
    >
      {joined ? "Apuntado" : "Apuntarme"}
    </button>
  );
}
