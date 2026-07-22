"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle, Plus } from "lucide-react";
import { useKeyedOptimisticBoolean } from "@/components/social/use-keyed-optimistic-boolean";
import { AppToast } from "@/components/ui/app-toast";
import { useAuthGuard } from "@/features/auth/use-auth-guard";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { requestCommunityDataRefresh } from "@/features/community/community-events";
import {
  followVillage,
  getVillageByIdStrict,
  unfollowVillage,
} from "@/lib/api/villages.service";
import { isNotFoundError, isUnauthorizedError } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { clearSession, getStoredToken } from "@/lib/api/session";
import { cn } from "@/lib/utils";

export function FollowButton({
  label = "Seguir pueblo",
  followedLabel = "Siguiendo",
  className,
  initialFollowing = false,
  hydrateFromApi = false,
  storageKey,
  interactionSupported = true,
  demo = false,
}: {
  label?: string;
  followedLabel?: string;
  className?: string;
  initialFollowing?: boolean;
  hydrateFromApi?: boolean;
  storageKey?: string;
  interactionSupported?: boolean;
  demo?: boolean;
}) {
  const { user } = useAuthSession();
  const localKey = storageKey && user?.id
    ? `cp:user:${user.id}:village:${storageKey}:following`
    : undefined;
  const [following, setFollowing] = useKeyedOptimisticBoolean(localKey, initialFollowing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"error" | "info">("error");
  const requestInFlight = useRef(false);
  const { authModal, requireAuth } = useAuthGuard();

  useEffect(() => {
    const token = getStoredToken();
    if (!hydrateFromApi || !interactionSupported || !storageKey || !token) return;

    let active = true;

    getVillageByIdStrict(storageKey, token)
      .then((village) => {
        if (active && typeof village?.isFollowing === "boolean") {
          setFollowing(village.isFollowing);
        }
      })
      .catch((error) => {
        if (isUnauthorizedError(error)) clearSession();
      });

    return () => {
      active = false;
    };
  }, [hydrateFromApi, interactionSupported, setFollowing, storageKey]);

  async function toggleFollowing() {
    if (requestInFlight.current) return;

    const next = !following;
    const token = getStoredToken();

    setErrorMessage("");
    setMessageTone("error");

    if (!storageKey) {
      setErrorMessage("No se pudo identificar el pueblo.");
      return;
    }

    if (!interactionSupported) {
      setMessageTone("info");
      setErrorMessage(
        demo
          ? "Este pueblo forma parte de los datos de demostración y todavía no admite seguimiento persistente."
          : "Este pueblo no está disponible para seguimiento persistente.",
      );
      return;
    }

    if (!token) {
      requireAuth("Para seguir pueblos necesitas iniciar sesión.", () => undefined);
      return;
    }

    requestInFlight.current = true;
    setIsSubmitting(true);
    setFollowing(next);

    try {
      const response = next
        ? await followVillage(storageKey, token)
        : await unfollowVillage(storageKey, token);
      const confirmedFollowing = response.followed ?? response.is_following;

      if (typeof confirmedFollowing === "boolean") {
        setFollowing(confirmedFollowing);
      }
      requestCommunityDataRefresh();
    } catch (error) {
      setFollowing(!next);
      if (isUnauthorizedError(error)) {
        clearSession();
        setErrorMessage("Tu sesión ha caducado. Inicia sesión nuevamente para continuar.");
      } else if (isNotFoundError(error)) {
        setErrorMessage("No encontramos este pueblo. Actualiza el contenido e inténtalo nuevamente.");
      } else {
        setErrorMessage(
          getApiErrorMessage(error, "No se pudo actualizar el seguimiento."),
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
          aria-pressed={following}
          className={cn(
            "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-extrabold transition-colors focus:outline-none focus:ring-4 focus:ring-[#347A4824]",
            following
              ? "bg-[#184B34] text-white"
              : "border border-[#184B341c] bg-white text-[#184B34] hover:bg-[#F7F2E8]",
            className,
          )}
          disabled={isSubmitting}
          type="button"
          onClick={(event) => {
            event.preventDefault();
            toggleFollowing();
          }}
        >
          {isSubmitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : following ? <Check aria-hidden="true" className="size-4" /> : <Plus aria-hidden="true" className="size-4" />}
          {following ? followedLabel : label}
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
