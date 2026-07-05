"use client";

import { useState } from "react";
import { useLocalStorageBoolean } from "@/components/social/use-local-storage-boolean";
import { followVillage, unfollowVillage } from "@/lib/api/villages.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { clearSession, getStoredToken } from "@/lib/api/session";
import { cn } from "@/lib/utils";

export function FollowButton({
  label = "Seguir pueblo",
  followedLabel = "Siguiendo",
  className,
  initialFollowing = false,
  storageKey,
}: {
  label?: string;
  followedLabel?: string;
  className?: string;
  initialFollowing?: boolean;
  storageKey?: string;
}) {
  const localKey = storageKey ? `cp:village:${storageKey}:following` : undefined;
  const [following, setFollowing] = useLocalStorageBoolean(localKey, initialFollowing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function toggleFollowing() {
    const next = !following;
    const token = getStoredToken();

    setErrorMessage("");

    if (!storageKey || !token) {
      setErrorMessage("Debes iniciar sesión para seguir pueblos.");
      return;
    }

    setFollowing(next);

    try {
      setIsSubmitting(true);
      const response = next
        ? await followVillage(storageKey, token)
        : await unfollowVillage(storageKey, token);

      if (typeof response.followed === "boolean") {
        setFollowing(response.followed);
      }
    } catch (error) {
      console.error("Error updating village follow:", error);
      setFollowing(!next);
      if (isUnauthorizedError(error)) {
        clearSession();
        setErrorMessage("Debes iniciar sesión para seguir pueblos.");
      } else {
        setErrorMessage("No se pudo actualizar el seguimiento.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-2">
      <button
        aria-pressed={following}
        className={cn(
          "inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-black transition-colors focus:outline-none focus:ring-4 focus:ring-[#3A7D4424]",
          following
            ? "bg-[#1F3D2B] text-white"
            : "bg-white text-[#1F3D2B] hover:bg-[#F3F4F6]",
          className,
        )}
        disabled={isSubmitting}
        type="button"
        onClick={(event) => {
          event.preventDefault();
          toggleFollowing();
        }}
      >
        {following ? followedLabel : label}
      </button>
      {errorMessage ? (
        <span className="text-xs font-bold text-red-700" role="alert">
          {errorMessage}
        </span>
      ) : null}
    </span>
  );
}
