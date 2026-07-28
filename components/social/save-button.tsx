"use client";

import { useEffect, useRef, useState } from "react";
import { Bookmark, LoaderCircle } from "lucide-react";
import { useKeyedOptimisticBoolean } from "@/components/social/use-keyed-optimistic-boolean";
import { AppToast } from "@/components/ui/app-toast";
import { useAuthGuard } from "@/features/auth/use-auth-guard";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { requestCommunityDataRefresh } from "@/features/community/community-events";
import {
  getActivityByIdStrict,
  saveActivity,
  unsaveActivity,
} from "@/lib/api/activities.service";
import { isNotFoundError, isUnauthorizedError } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { clearSession, getStoredToken } from "@/lib/api/session";
import { cn } from "@/lib/utils";

export function SaveButton({
  initialSaved = false,
  compact = false,
  hydrateFromApi = false,
  storageKey,
  interactionSupported = true,
  demo = false,
  onInteractionStart,
}: {
  initialSaved?: boolean;
  compact?: boolean;
  hydrateFromApi?: boolean;
  storageKey?: string;
  interactionSupported?: boolean;
  demo?: boolean;
  onInteractionStart?: () => void;
}) {
  const { user } = useAuthSession();
  const localKey = storageKey && user?.id
    ? `cp:user:${user.id}:item:${storageKey}:saved`
    : undefined;
  const [saved, setSaved] = useKeyedOptimisticBoolean(localKey, initialSaved);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "info">("error");
  const requestInFlight = useRef(false);
  const { authModal, requireAuth } = useAuthGuard();

  useEffect(() => {
    const token = getStoredToken();
    const activityId = storageKey?.startsWith("activity:")
      ? storageKey.replace("activity:", "")
      : undefined;
    if (!hydrateFromApi || !interactionSupported || !activityId || !token) return;

    let active = true;

    getActivityByIdStrict(activityId, token)
      .then((activity) => {
        if (active && typeof activity?.isSaved === "boolean") {
          setSaved(activity.isSaved);
        }
      })
      .catch((error) => {
        if (isUnauthorizedError(error)) clearSession();
      });

    return () => {
      active = false;
    };
  }, [hydrateFromApi, interactionSupported, setSaved, storageKey]);

  async function toggleSaved() {
    if (requestInFlight.current) return;

    const next = !saved;
    const token = getStoredToken();
    const activityId = storageKey?.startsWith("activity:")
      ? storageKey.replace("activity:", "")
      : undefined;

    setErrorMessage("");
    setMessageTone("error");

    if (!activityId) {
      setErrorMessage("No se pudo identificar la actividad.");
      return;
    }

    if (!interactionSupported) {
      setMessageTone("info");
      setErrorMessage(
        demo
          ? "Esta actividad forma parte de los datos de demostración y todavía no admite guardado persistente."
          : "Esta actividad no está disponible para guardado persistente.",
      );
      return;
    }

    if (!token) {
      requireAuth("Para guardar actividades necesitas iniciar sesión.", () => undefined);
      return;
    }

    requestInFlight.current = true;
    onInteractionStart?.();
    setIsSubmitting(true);
    setSaved(next);

    try {
      const response = next
        ? await saveActivity(activityId, token)
        : await unsaveActivity(activityId, token);
      const confirmedSaved = response.saved ?? response.is_saved;

      if (typeof confirmedSaved === "boolean") {
        setSaved(confirmedSaved);
      }
      requestCommunityDataRefresh();
    } catch (error) {
      setSaved(!next);
      if (isUnauthorizedError(error)) {
        clearSession();
        setErrorMessage("Tu sesión ha caducado. Inicia sesión nuevamente para continuar.");
      } else if (isNotFoundError(error)) {
        setErrorMessage("No encontramos esta actividad. Actualiza el contenido e inténtalo nuevamente.");
      } else {
        setErrorMessage(
          getApiErrorMessage(error, "No se pudo actualizar el guardado."),
        );
      }
    } finally {
      requestInFlight.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <span className="inline-flex items-start">
        <button
          aria-pressed={saved}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-extrabold transition-colors focus:outline-none focus:ring-4 focus:ring-[#347A4824]",
            saved
              ? "bg-[#184B34] text-white"
              : "bg-[#184B340d] text-[#184B34] hover:bg-[#184B3418]",
            compact && "min-h-11 px-3 text-xs",
          )}
          disabled={isSubmitting}
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggleSaved();
          }}
        >
          {isSubmitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Bookmark aria-hidden="true" className="size-4" fill={saved ? "currentColor" : "none"} />}
          {saved ? "Guardado" : "Guardar"}
        </button>
      </span>
      <AppToast
        message={errorMessage}
        onDismiss={() => setErrorMessage("")}
        tone={messageTone}
      />
      {authModal}
    </>
  );
}
