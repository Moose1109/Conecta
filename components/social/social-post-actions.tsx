"use client";

import { useState } from "react";
import { MockActionButton } from "@/components/social/mock-action-button";
import { getStoredToken } from "@/lib/api/session";
import { likePost, savePost, unlikePost, unsavePost } from "@/lib/api/community.service";

export function SocialPostActions({
  storageKey,
  likes = 0,
  comments = 0,
  shares = 0,
  saved = false,
  initiallyLiked = false,
}: {
  storageKey?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  saved?: boolean;
  initiallyLiked?: boolean;
}) {
  const likeKey = storageKey ? `cp:post:${storageKey}:liked` : undefined;
  const saveKey = storageKey ? `cp:post:${storageKey}:saved` : undefined;
  const [isLiked, setIsLiked] = useState(() => {
    if (typeof window === "undefined" || !likeKey) {
      return initiallyLiked;
    }

    return window.localStorage.getItem(likeKey) === "true" || initiallyLiked;
  });
  const [isSaved, setIsSaved] = useState(() => {
    if (typeof window === "undefined" || !saveKey) {
      return saved;
    }

    return window.localStorage.getItem(saveKey) === "true" || saved;
  });

  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  const [isSubmittingSave, setIsSubmittingSave] = useState(false);

  async function toggleLiked() {
    const next = !isLiked;
    const token = getStoredToken();

    setIsLiked(next);

    if (likeKey) {
      window.localStorage.setItem(likeKey, String(next));
    }

    if (!storageKey || !token) {
      return;
    }

    try {
      setIsSubmittingLike(true);
      const response = next
        ? await likePost(storageKey, token)
        : await unlikePost(storageKey, token);

      if (typeof response.liked === "boolean") {
        setIsLiked(response.liked);
        if (likeKey) {
          window.localStorage.setItem(likeKey, String(response.liked));
        }
      }
    } catch (error) {
      console.error("Error updating post like:", error);
      setIsLiked(!next);
      if (likeKey) {
        window.localStorage.setItem(likeKey, String(!next));
      }
    } finally {
      setIsSubmittingLike(false);
    }
  }

  async function toggleSaved() {
    const next = !isSaved;
    const token = getStoredToken();

    setIsSaved(next);

    if (saveKey) {
      window.localStorage.setItem(saveKey, String(next));
    }

    if (!storageKey || !token) {
      return;
    }

    try {
      setIsSubmittingSave(true);
      const response = next
        ? await savePost(storageKey, token)
        : await unsavePost(storageKey, token);

      if (typeof response.saved === "boolean") {
        setIsSaved(response.saved);
        if (saveKey) {
          window.localStorage.setItem(saveKey, String(response.saved));
        }
      }
    } catch (error) {
      console.error("Error updating post save:", error);
      setIsSaved(!next);
      if (saveKey) {
        window.localStorage.setItem(saveKey, String(!next));
      }
    } finally {
      setIsSubmittingSave(false);
    }
  }

  return (
    <div className="grid grid-cols-2 gap-2 border-t border-[#1F3D2B12] px-3 py-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
      <MockActionButton
        aria-pressed={isLiked}
        className={isLiked ? "bg-[#D9A44124] text-[#1F3D2B]" : undefined}
        disabled={isSubmittingLike}
        onClick={toggleLiked}
      >
        Me gusta {isLiked ? likes + 1 : likes}
      </MockActionButton>
      <MockActionButton>Comentar {comments}</MockActionButton>
      <MockActionButton>Compartir {shares}</MockActionButton>
      <MockActionButton
        aria-pressed={isSaved}
        className={isSaved ? "bg-[#1F3D2B] text-white hover:bg-[#1F3D2B]" : undefined}
        disabled={isSubmittingSave}
        onClick={toggleSaved}
      >
        {isSaved ? "Guardado" : "Guardar"}
      </MockActionButton>
    </div>
  );
}
