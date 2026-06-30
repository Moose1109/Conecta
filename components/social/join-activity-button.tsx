"use client";

import { useState } from "react";
import { joinActivity, leaveActivity } from "@/lib/api/activities.service";
import { getStoredToken } from "@/lib/api/session";
import { cn } from "@/lib/utils";

export function JoinActivityButton({
  className,
  compact = false,
  initialJoined = false,
  storageKey,
}: {
  className?: string;
  compact?: boolean;
  initialJoined?: boolean;
  storageKey?: string;
}) {
  const localKey = storageKey ? `cp:activity:${storageKey}:joined` : undefined;
  const [joined, setJoined] = useState(() => {
    if (typeof window === "undefined" || !localKey) {
      return initialJoined;
    }

    return window.localStorage.getItem(localKey) === "true" || initialJoined;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function toggleJoined() {
    const next = !joined;
    const token = getStoredToken();

    setJoined(next);

    if (localKey) {
      window.localStorage.setItem(localKey, String(next));
    }

    if (!storageKey || !token) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = next
        ? await joinActivity(storageKey, token)
        : await leaveActivity(storageKey, token);

      if (typeof response.joined === "boolean") {
        setJoined(response.joined);
        if (localKey) {
          window.localStorage.setItem(localKey, String(response.joined));
        }
      }
    } catch (error) {
      console.error("Error updating activity join:", error);
      setJoined(!next);
      if (localKey) {
        window.localStorage.setItem(localKey, String(!next));
      }
    } finally {
      setIsSubmitting(false);
    }
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
      disabled={isSubmitting}
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
