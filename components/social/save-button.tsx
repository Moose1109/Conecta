"use client";

import { useState } from "react";
import { useLocalStorageBoolean } from "@/components/social/use-local-storage-boolean";
import { useAuthGuard } from "@/features/auth/use-auth-guard";
import { saveActivity, unsaveActivity } from "@/lib/api/activities.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { clearSession, getStoredToken } from "@/lib/api/session";
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
  const [saved, setSaved] = useLocalStorageBoolean(localKey, initialSaved);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { authModal, requireAuth } = useAuthGuard();

  async function toggleSaved() {
    const next = !saved;
    const token = getStoredToken();
    const activityId = storageKey?.startsWith("activity:")
      ? storageKey.replace("activity:", "")
      : undefined;

    setErrorMessage("");

    if (!activityId) {
      setErrorMessage("No se pudo identificar la actividad.");
      return;
    }

    if (!token) {
      requireAuth("Para guardar actividades necesitas iniciar sesión.", () => undefined);
      return;
    }

    setSaved(next);

    try {
      setIsSubmitting(true);
      const response = next
        ? await saveActivity(activityId, token)
        : await unsaveActivity(activityId, token);

      if (typeof response.saved === "boolean") {
        setSaved(response.saved);
      }
    } catch (error) {
      console.error("Error updating activity save:", error);
      setSaved(!next);
      if (isUnauthorizedError(error)) {
        clearSession();
        setErrorMessage("Tu sesión ha caducado. Vuelve a iniciar sesión para guardar.");
      } else {
        setErrorMessage("No se pudo actualizar el guardado.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <span className="inline-flex flex-col items-start gap-2">
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
        {errorMessage ? (
          <span className="text-xs font-bold text-red-700" role="alert">
            {errorMessage}
          </span>
        ) : null}
      </span>
      {authModal}
    </>
  );
}
