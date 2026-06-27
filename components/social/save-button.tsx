"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function SaveButton({
  initialSaved = false,
  compact = false,
  storageKey,
}: {
  initialSaved?: boolean;
  compact?: boolean;
  storageKey?: string;
}) {
  const localKey = storageKey ? `cp:item:${storageKey}:saved` : undefined;
  const [saved, setSaved] = useState(() => {
    if (typeof window === "undefined" || !localKey) {
      return initialSaved;
    }

    return window.localStorage.getItem(localKey) === "true" || initialSaved;
  });

  function toggleSaved() {
    setSaved((value) => {
      const next = !value;
      if (localKey) {
        window.localStorage.setItem(localKey, String(next));
      }
      return next;
    });
  }

  return (
    <button
      aria-pressed={saved}
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-[#3A7D4424]",
        saved
          ? "bg-[#1F3D2B] text-white"
          : "bg-[#3A7D4414] text-[#3A7D44] hover:bg-[#3A7D4424]",
        compact && "min-h-8 px-3 text-xs",
      )}
      type="button"
      onClick={(event) => {
        event.preventDefault();
        toggleSaved();
      }}
    >
      {saved ? "Guardado" : "Guardar"}
    </button>
  );
}
