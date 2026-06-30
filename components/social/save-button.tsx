"use client";

import { useState } from "react";
import { saveActivity, unsaveActivity } from "@/lib/api/activities.service";
import { getStoredToken } from "@/lib/api/session";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function toggleSaved() {
    const next = !saved;
    const token = getStoredToken();

    setSaved(next);

    if (localKey) {
      window.localStorage.setItem(localKey, String(next));
    }

    const activityId = storageKey?.startsWith("activity:")
      ? storageKey.replace("activity:", "")
      : undefined;

    if (!activityId || !token) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = next
        ? await saveActivity(activityId, token)
        : await unsaveActivity(activityId, token);

      if (typeof response.saved === "boolean") {
        setSaved(response.saved);
        if (localKey) {
          window.localStorage.setItem(localKey, String(response.saved));
        }
      }
    } catch (error) {
      console.error("Error updating activity save:", error);
      setSaved(!next);
      if (localKey) {
        window.localStorage.setItem(localKey, String(!next));
      }
    } finally {
      setIsSubmitting(false);
    }
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
      disabled={isSubmitting}
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
