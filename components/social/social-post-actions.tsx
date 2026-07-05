"use client";

import { useState } from "react";
import { SocialActionButton } from "@/components/social/social-action-button";
import { useLocalStorageBoolean } from "@/components/social/use-local-storage-boolean";
import { useAuthGuard } from "@/features/auth/use-auth-guard";
import { isUnauthorizedError } from "@/lib/api/client";
import { clearSession, getStoredToken } from "@/lib/api/session";
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
  const [isLiked, setIsLiked] = useLocalStorageBoolean(likeKey, initiallyLiked);
  const [isSaved, setIsSaved] = useLocalStorageBoolean(saveKey, saved);

  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  const [isSubmittingSave, setIsSubmittingSave] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { authModal, requireAuth } = useAuthGuard();

  async function toggleLiked() {
    const next = !isLiked;
    const token = getStoredToken();

    setErrorMessage("");

    if (!storageKey) {
      setErrorMessage("No se pudo identificar la publicación.");
      return;
    }

    if (!token) {
      requireAuth("Para dar like necesitas iniciar sesión.", () => undefined);
      return;
    }

    setIsLiked(next);

    try {
      setIsSubmittingLike(true);
      const response = next
        ? await likePost(storageKey, token)
        : await unlikePost(storageKey, token);

      if (typeof response.liked === "boolean") {
        setIsLiked(response.liked);
      }
    } catch (error) {
      console.error("Error updating post like:", error);
      setIsLiked(!next);
      if (isUnauthorizedError(error)) {
        clearSession();
        setErrorMessage("Tu sesión ha caducado. Vuelve a iniciar sesión para dar like.");
      } else {
        setErrorMessage("No se pudo actualizar el like.");
      }
    } finally {
      setIsSubmittingLike(false);
    }
  }

  async function toggleSaved() {
    const next = !isSaved;
    const token = getStoredToken();

    setErrorMessage("");

    if (!storageKey) {
      setErrorMessage("No se pudo identificar la publicación.");
      return;
    }

    if (!token) {
      requireAuth("Para guardar publicaciones necesitas iniciar sesión.", () => undefined);
      return;
    }

    setIsSaved(next);

    try {
      setIsSubmittingSave(true);
      const response = next
        ? await savePost(storageKey, token)
        : await unsavePost(storageKey, token);

      if (typeof response.saved === "boolean") {
        setIsSaved(response.saved);
      }
    } catch (error) {
      console.error("Error updating post save:", error);
      setIsSaved(!next);
      if (isUnauthorizedError(error)) {
        clearSession();
        setErrorMessage("Tu sesión ha caducado. Vuelve a iniciar sesión para guardar.");
      } else {
        setErrorMessage("No se pudo actualizar el guardado.");
      }
    } finally {
      setIsSubmittingSave(false);
    }
  }

  function showPendingAction(action: "comentar" | "compartir") {
    requireAuth(
      action === "comentar"
        ? "Para comentar necesitas iniciar sesión."
        : "Para compartir publicaciones necesitas iniciar sesión.",
      () => {
        setErrorMessage(
          action === "comentar"
            ? "Funcionalidad pendiente: falta crear el endpoint para comentar."
            : "Funcionalidad pendiente: falta crear el endpoint para compartir.",
        );
      },
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 border-t border-[#1F3D2B12] px-3 py-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
        <SocialActionButton
          aria-pressed={isLiked}
          className={isLiked ? "bg-[#D9A44124] text-[#1F3D2B]" : undefined}
          disabled={isSubmittingLike}
          onClick={toggleLiked}
        >
          <svg
            aria-hidden="true"
            className="size-4 shrink-0 transition-colors"
            fill={isLiked ? "#E53935" : "#FFFFFF"}
            stroke={isLiked ? "#E53935" : "#1F3D2B"}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M19.5 12.6 12 20l-7.5-7.4A5 5 0 0 1 12 6.1a5 5 0 0 1 7.5 6.5Z" />
          </svg>
          Me gusta {isLiked ? likes + 1 : likes}
        </SocialActionButton>
        <SocialActionButton onClick={() => showPendingAction("comentar")}>
          Comentar {comments}
        </SocialActionButton>
        <SocialActionButton onClick={() => showPendingAction("compartir")}>
          Compartir {shares}
        </SocialActionButton>
        <SocialActionButton
          aria-pressed={isSaved}
          className={isSaved ? "bg-[#1F3D2B] text-white hover:bg-[#1F3D2B]" : undefined}
          disabled={isSubmittingSave}
          onClick={toggleSaved}
        >
          {isSaved ? "Guardado" : "Guardar"}
        </SocialActionButton>
        {errorMessage ? (
          <p className="col-span-2 text-center text-xs font-bold text-red-700 sm:basis-full" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </div>
      {authModal}
    </>
  );
}
