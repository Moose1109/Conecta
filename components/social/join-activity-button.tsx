"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarCheck2, LoaderCircle, Plus } from "lucide-react";
import { useKeyedOptimisticBoolean } from "@/components/social/use-keyed-optimistic-boolean";
import { AppToast } from "@/components/ui/app-toast";
import { useAuthGuard } from "@/features/auth/use-auth-guard";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { requestCommunityDataRefresh } from "@/features/community/community-events";
import {
  getActivityByIdStrict,
  joinActivity,
  leaveActivity,
} from "@/lib/api/activities.service";
import { isNotFoundError, isUnauthorizedError } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { clearSession, getStoredToken } from "@/lib/api/session";
import { cn } from "@/lib/utils";

export function JoinActivityButton({
  className,
  compact = false,
  hydrateFromApi = false,
  initialJoined = false,
  interactionSupported = true,
  demo = false,
  storageKey,
  onInteractionStart,
}: {
  className?: string;
  compact?: boolean;
  hydrateFromApi?: boolean;
  initialJoined?: boolean;
  interactionSupported?: boolean;
  demo?: boolean;
  storageKey?: string;
  onInteractionStart?: () => void;
}) {
  const { user } = useAuthSession();
  const localKey = storageKey && user?.id
    ? `cp:user:${user.id}:activity:${storageKey}:joined`
    : undefined;
  const [joined, setJoined] = useKeyedOptimisticBoolean(localKey, initialJoined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "info">("error");
  const requestInFlight = useRef(false);
  const { authModal, requireAuth } = useAuthGuard();

  useEffect(() => {
    const token = getStoredToken();
    if (!hydrateFromApi || !interactionSupported || !storageKey || !token) return;

    let active = true;

    getActivityByIdStrict(storageKey, token)
      .then((activity) => {
        if (active && typeof activity?.isJoined === "boolean") {
          setJoined(activity.isJoined);
        }
      })
      .catch((error) => {
        if (isUnauthorizedError(error)) clearSession();
      });

    return () => {
      active = false;
    };
  }, [hydrateFromApi, interactionSupported, setJoined, storageKey]);

  async function toggleJoined() {
    if (requestInFlight.current) return;

    const next = !joined;
    const token = getStoredToken();

    setErrorMessage("");
    setMessageTone("error");

    if (!storageKey) {
      setErrorMessage("No se pudo identificar la actividad.");
      return;
    }

    if (!interactionSupported) {
      setMessageTone("info");
      setErrorMessage(
        demo
          ? "Esta actividad forma parte de los datos de demostración y todavía no admite inscripciones persistentes."
          : "Esta actividad no está disponible para inscripciones persistentes.",
      );
      return;
    }

    if (!token) {
      requireAuth("Para apuntarte a una actividad necesitas iniciar sesión.", () => undefined);
      return;
    }

    requestInFlight.current = true;
    onInteractionStart?.();
    setIsSubmitting(true);
    setJoined(next);

    try {
      const response = next
        ? await joinActivity(storageKey, token)
        : await leaveActivity(storageKey, token);
      const confirmedJoined = response.joined ?? response.is_joined;

      if (typeof confirmedJoined === "boolean") {
        setJoined(confirmedJoined);
      }
      requestCommunityDataRefresh();
    } catch (error) {
      setJoined(!next);
      if (isUnauthorizedError(error)) {
        clearSession();
        setErrorMessage("Tu sesión ha caducado. Inicia sesión nuevamente para continuar.");
      } else if (isNotFoundError(error)) {
        setErrorMessage("No encontramos esta actividad. Actualiza el contenido e inténtalo nuevamente.");
      } else {
        setErrorMessage(
          getApiErrorMessage(error, "No se pudo actualizar la inscripción."),
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
          aria-pressed={joined}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-5 text-sm font-extrabold transition-colors focus:outline-none focus:ring-4 focus:ring-[#347A4824]",
            joined
              ? "bg-[#D7A63C] text-[#18231D] hover:bg-[#C8952D]"
              : "bg-[#184B34] text-white hover:bg-[#0E3325]",
            compact && "min-h-11 px-4 text-xs",
            className,
          )}
          disabled={isSubmitting}
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggleJoined();
          }}
        >
          {isSubmitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : joined ? <CalendarCheck2 aria-hidden="true" className="size-4" /> : <Plus aria-hidden="true" className="size-4" />}
          {joined ? "Apuntado" : "Apuntarme"}
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
