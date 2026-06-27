"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function SaveButton({
  initialSaved = false,
  compact = false,
}: {
  initialSaved?: boolean;
  compact?: boolean;
}) {
  const [saved, setSaved] = useState(initialSaved);

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
        setSaved((value) => !value);
      }}
    >
      {saved ? "Guardado" : "Guardar"}
    </button>
  );
}
