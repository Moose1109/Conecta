"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function FollowButton({
  label = "Seguir pueblo",
  followedLabel = "Siguiendo",
  className,
  storageKey,
}: {
  label?: string;
  followedLabel?: string;
  className?: string;
  storageKey?: string;
}) {
  const localKey = storageKey ? `cp:village:${storageKey}:following` : undefined;
  const [following, setFollowing] = useState(() => {
    if (typeof window === "undefined" || !localKey) {
      return false;
    }

    return window.localStorage.getItem(localKey) === "true";
  });

  function toggleFollowing() {
    setFollowing((value) => {
      const next = !value;
      if (localKey) {
        window.localStorage.setItem(localKey, String(next));
      }
      return next;
    });
  }

  return (
    <button
      aria-pressed={following}
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-[#3A7D4424]",
        following
          ? "bg-[#1F3D2B] text-white"
          : "bg-white text-[#1F3D2B] hover:bg-[#F3F4F6]",
        className,
      )}
      type="button"
      onClick={(event) => {
        event.preventDefault();
        toggleFollowing();
      }}
    >
      {following ? followedLabel : label}
    </button>
  );
}
