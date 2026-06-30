"use client";

import { useState } from "react";
import { followVillage, unfollowVillage } from "@/lib/api/villages.service";
import { getStoredToken } from "@/lib/api/session";
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
  const [following, setFollowing] = useState(() => {
    if (typeof window === "undefined" || !localKey) {
      return initialFollowing;
    }

    return window.localStorage.getItem(localKey) === "true" || initialFollowing;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function toggleFollowing() {
    const next = !following;
    const token = getStoredToken();

    setFollowing(next);

    if (localKey) {
      window.localStorage.setItem(localKey, String(next));
    }

    if (!storageKey || !token) {
      return;
    }

    try {
      setIsSubmitting(true);
      const response = next
        ? await followVillage(storageKey, token)
        : await unfollowVillage(storageKey, token);

      if (typeof response.followed === "boolean") {
        setFollowing(response.followed);
        if (localKey) {
          window.localStorage.setItem(localKey, String(response.followed));
        }
      }
    } catch (error) {
      console.error("Error updating village follow:", error);
      setFollowing(!next);
      if (localKey) {
        window.localStorage.setItem(localKey, String(!next));
      }
    } finally {
      setIsSubmitting(false);
    }
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
      disabled={isSubmitting}
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
