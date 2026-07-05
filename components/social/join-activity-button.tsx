"use client";

import { useState } from "react";
import { useLocalStorageBoolean } from "@/components/social/use-local-storage-boolean";
import { joinActivity, leaveActivity } from "@/lib/api/activities.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { clearSession, getStoredToken } from "@/lib/api/session";
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
  const [joined, setJoined] = useLocalStorageBoolean(localKey, initialJoined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function toggleJoined() {
    const next = !joined;
    const token = getStoredToken();

    setErrorMessage("");

    if (!storageKey || !token) {
      setErrorMessage("Debes iniciar sesión para apuntarte.");
      return;
    }

    setJoined(next);

    try {
      setIsSubmitting(true);
      const response = next
        ? await joinActivity(storageKey, token)
        : await leaveActivity(storageKey, token);

      if (typeof response.joined === "boolean") {
        setJoined(response.joined);
      }
    } catch (error) {
      console.error("Error updating activity join:", error);
      setJoined(!next);
      if (isUnauthorizedError(error)) {
        clearSession();
        setErrorMessage("Debes iniciar sesión para apuntarte.");
      } else {
        setErrorMessage("No se pudo actualizar la inscripción.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-2">
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
      {errorMessage ? (
        <span className="text-xs font-bold text-red-700" role="alert">
          {errorMessage}
        </span>
      ) : null}
    </span>
  );
}
