"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function JoinActivityButton({
  className,
  compact = false,
}: {
  className?: string;
  compact?: boolean;
}) {
  const [joined, setJoined] = useState(false);

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
        setJoined((value) => !value);
      }}
    >
      {joined ? "Apuntado" : "Apuntarme"}
    </button>
  );
}
