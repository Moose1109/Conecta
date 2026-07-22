"use client";

import {
  Bookmark,
  Heart,
  LoaderCircle,
  MessageCircle,
  Share2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SocialActionButton } from "@/components/social/social-action-button";
import { useKeyedOptimisticBoolean } from "@/components/social/use-keyed-optimistic-boolean";
import { AppToast } from "@/components/ui/app-toast";
import { useAuthGuard } from "@/features/auth/use-auth-guard";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { requestCommunityDataRefresh } from "@/features/community/community-events";
import { ApiError, isNotFoundError, isUnauthorizedError } from "@/lib/api/client";
import {
  getCommunityPostByIdStrict,
  likePost,
  savePost,
  unlikePost,
  unsavePost,
} from "@/lib/api/community.service";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { clearSession, getStoredToken } from "@/lib/api/session";
import { cn } from "@/lib/utils";

type ActionMessage = {
  kind: "error" | "pending";
  text: string;
};

export function SocialPostActions({
  storageKey,
  likes = 0,
  comments = 0,
  hydrateFromApi = false,
  shares = 0,
  saved = false,
  initiallyLiked = false,
  interactionSupported = true,
  demo = false,
}: {
  storageKey?: string;
  likes?: number;
  comments?: number;
  hydrateFromApi?: boolean;
  shares?: number;
  saved?: boolean;
  initiallyLiked?: boolean;
  interactionSupported?: boolean;
  demo?: boolean;
}) {
  const { user } = useAuthSession();
  const likeKey = storageKey && user?.id
    ? `cp:user:${user.id}:post:${storageKey}:liked`
    : undefined;
  const saveKey = storageKey && user?.id
    ? `cp:user:${user.id}:post:${storageKey}:saved`
    : undefined;
  const [isLiked, setIsLiked] = useKeyedOptimisticBoolean(likeKey, initiallyLiked);
  const [isSaved, setIsSaved] = useKeyedOptimisticBoolean(saveKey, saved);
  const [isSubmittingLike, setIsSubmittingLike] = useState(false);
  const [isSubmittingSave, setIsSubmittingSave] = useState(false);
  const [likeCountOverride, setLikeCountOverride] = useState<{
    baselineLiked: boolean;
    baselineLikes: number;
    key?: string;
    value: number;
  }>();
  const [message, setMessage] = useState<ActionMessage | null>(null);
  const likeRequestInFlight = useRef(false);
  const saveRequestInFlight = useRef(false);
  const { authModal, requireAuth } = useAuthGuard();
  const currentLikeOverride =
    likeCountOverride &&
    likeCountOverride.key === storageKey &&
    likeCountOverride.baselineLiked === initiallyLiked &&
    likeCountOverride.baselineLikes === likes
      ? likeCountOverride.value
      : undefined;
  const displayedLikes = currentLikeOverride ?? (
    isLiked === initiallyLiked ? likes : isLiked ? likes + 1 : Math.max(0, likes - 1)
  );
  const hasMetrics = displayedLikes > 0 || comments > 0 || shares > 0;

  useEffect(() => {
    const token = getStoredToken();
    if (!hydrateFromApi || !interactionSupported || !storageKey || !token) return;

    let active = true;

    getCommunityPostByIdStrict(storageKey, token)
      .then((post) => {
        if (!active || !post) return;

        setIsLiked(Boolean(post.isLiked));
        setIsSaved(Boolean(post.isSaved ?? post.saved));
        if (typeof post.likes === "number") {
          setLikeCountOverride({
            baselineLiked: initiallyLiked,
            baselineLikes: likes,
            key: storageKey,
            value: Math.max(0, post.likes),
          });
        }
      })
      .catch((error) => {
        if (!active) return;
        if (isUnauthorizedError(error)) {
          clearSession();
          setMessage({
            kind: "error",
            text: "Tu sesión ha caducado. Inicia sesión nuevamente para continuar.",
          });
        } else {
          setMessage({
            kind: "error",
            text: "No hemos podido confirmar tu reacción y guardado en esta publicación.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [
    hydrateFromApi,
    interactionSupported,
    initiallyLiked,
    likes,
    setIsLiked,
    setIsSaved,
    storageKey,
  ]);

  async function toggleLiked() {
    if (likeRequestInFlight.current) return;

    const next = !isLiked;
    const token = getStoredToken();

    setMessage(null);

    if (!storageKey) {
      setMessage({ kind: "error", text: "No se pudo identificar la publicación." });
      return;
    }

    if (!interactionSupported) {
      setMessage({
        kind: "pending",
        text: demo
          ? "Esta publicación forma parte de los datos de demostración y todavía no admite interacciones persistentes."
          : "Esta publicación no está disponible para interacciones persistentes.",
      });
      return;
    }

    if (!token) {
      requireAuth("Para indicar que te gusta una publicación necesitas iniciar sesión.", () => undefined);
      return;
    }

    const previousLikes = displayedLikes;
    likeRequestInFlight.current = true;
    setIsSubmittingLike(true);
    setIsLiked(next);
    setLikeCountOverride({
      baselineLiked: initiallyLiked,
      baselineLikes: likes,
      key: storageKey,
      value: next ? previousLikes + 1 : Math.max(0, previousLikes - 1),
    });

    try {
      const response = next
        ? await likePost(storageKey, token)
        : await unlikePost(storageKey, token);
      const confirmedLiked = response.liked ?? response.is_liked;

      if (typeof confirmedLiked === "boolean") {
        setIsLiked(confirmedLiked);
      }
      if (typeof response.likes_count === "number" && Number.isFinite(response.likes_count)) {
        setLikeCountOverride({
          baselineLiked: initiallyLiked,
          baselineLikes: likes,
          key: storageKey,
          value: Math.max(0, response.likes_count),
        });
      }
      requestCommunityDataRefresh();
    } catch (error) {
      setIsLiked(!next);
      setLikeCountOverride({
        baselineLiked: initiallyLiked,
        baselineLikes: likes,
        key: storageKey,
        value: previousLikes,
      });
      if (isUnauthorizedError(error)) {
        clearSession();
        setMessage({
          kind: "error",
          text: "Tu sesión ha caducado. Inicia sesión nuevamente para continuar.",
        });
      } else if (isNotFoundError(error)) {
        logPostNotFound(error, storageKey, demo ? "demo" : "persistent");
        setMessage({
          kind: "error",
          text: "No encontramos esta publicación. Actualiza el contenido e inténtalo nuevamente.",
        });
      } else if (error instanceof ApiError && error.isNetworkError && !error.isTimeout) {
        setMessage({ kind: "error", text: "No pudimos conectar con el servidor." });
      } else {
        setMessage({
          kind: "error",
          text: getApiErrorMessage(error, "No se pudo actualizar la reacción."),
        });
      }
    } finally {
      likeRequestInFlight.current = false;
      setIsSubmittingLike(false);
    }
  }

  async function toggleSaved() {
    if (saveRequestInFlight.current) return;

    const next = !isSaved;
    const token = getStoredToken();

    setMessage(null);

    if (!storageKey) {
      setMessage({ kind: "error", text: "No se pudo identificar la publicación." });
      return;
    }

    if (!interactionSupported) {
      setMessage({
        kind: "pending",
        text: demo
          ? "Esta publicación forma parte de los datos de demostración y todavía no admite interacciones persistentes."
          : "Esta publicación no está disponible para interacciones persistentes.",
      });
      return;
    }

    if (!token) {
      requireAuth("Para guardar publicaciones necesitas iniciar sesión.", () => undefined);
      return;
    }

    saveRequestInFlight.current = true;
    setIsSubmittingSave(true);
    setIsSaved(next);

    try {
      const response = next
        ? await savePost(storageKey, token)
        : await unsavePost(storageKey, token);
      const confirmedSaved = response.saved ?? response.is_saved;

      if (typeof confirmedSaved === "boolean") {
        setIsSaved(confirmedSaved);
      }
      requestCommunityDataRefresh();
    } catch (error) {
      setIsSaved(!next);
      if (isUnauthorizedError(error)) {
        clearSession();
        setMessage({
          kind: "error",
          text: "Tu sesión ha caducado. Inicia sesión nuevamente para continuar.",
        });
      } else if (isNotFoundError(error)) {
        logPostNotFound(error, storageKey, demo ? "demo" : "persistent");
        setMessage({
          kind: "error",
          text: "No encontramos esta publicación. Actualiza el contenido e inténtalo nuevamente.",
        });
      } else if (error instanceof ApiError && error.isNetworkError && !error.isTimeout) {
        setMessage({ kind: "error", text: "No pudimos conectar con el servidor." });
      } else {
        setMessage({
          kind: "error",
          text: getApiErrorMessage(error, "No se pudo actualizar el guardado."),
        });
      }
    } finally {
      saveRequestInFlight.current = false;
      setIsSubmittingSave(false);
    }
  }

  function showPendingAction(action: "comentar" | "compartir") {
    requireAuth(
      action === "comentar"
        ? "Para comentar necesitas iniciar sesión."
        : "Para compartir publicaciones necesitas iniciar sesión.",
      () => {
        setMessage({
          kind: "pending",
          text: "Esta función todavía necesita soporte del servidor.",
        });
      },
    );
  }

  return (
    <>
      {hasMetrics ? (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#184B340d] px-4 py-2.5 text-xs font-semibold text-[#687269] sm:px-5">
          <span className="inline-flex items-center gap-1.5">
            <span className="grid size-5 place-items-center rounded-full bg-[#C96D4A] text-white">
              <Heart aria-hidden="true" className="size-3" fill="currentColor" strokeWidth={1.8} />
            </span>
            {displayedLikes}
          </span>
          <span className="flex items-center gap-4">
            {comments > 0 ? <span>{comments} comentarios</span> : null}
            {shares > 0 ? <span>{shares} compartidos</span> : null}
          </span>
        </div>
      ) : null}

      <div className="grid grid-cols-4 gap-1 border-t border-[#184B3412] px-2 py-2 sm:px-3">
        <SocialActionButton
          aria-label={isLiked ? `Quitar Me gusta. ${displayedLikes} reacciones` : `Me gusta. ${displayedLikes} reacciones`}
          aria-pressed={isLiked}
          className={cn(isLiked && "bg-[#C96D4A12] text-[#A95539]")}
          disabled={isSubmittingLike}
          onClick={toggleLiked}
        >
          {isSubmittingLike ? (
            <LoaderCircle aria-hidden="true" className="size-[18px] animate-spin" />
          ) : (
            <Heart
              aria-hidden="true"
              className="size-[18px]"
              fill={isLiked ? "currentColor" : "none"}
              strokeWidth={1.8}
            />
          )}
          <span className="hidden sm:inline">Me gusta</span>
        </SocialActionButton>
        <SocialActionButton
          aria-label={`Comentar. ${comments} comentarios`}
          onClick={() => showPendingAction("comentar")}
        >
          <MessageCircle aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          <span className="hidden sm:inline">Comentar</span>
        </SocialActionButton>
        <SocialActionButton
          aria-label={`Compartir. ${shares} veces compartida`}
          onClick={() => showPendingAction("compartir")}
        >
          <Share2 aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
          <span className="hidden sm:inline">Compartir</span>
        </SocialActionButton>
        <SocialActionButton
          aria-label={isSaved ? "Quitar de guardados" : "Guardar publicación"}
          aria-pressed={isSaved}
          className={cn(isSaved && "bg-[#184B3410] text-[#184B34]")}
          disabled={isSubmittingSave}
          onClick={toggleSaved}
        >
          {isSubmittingSave ? (
            <LoaderCircle aria-hidden="true" className="size-[18px] animate-spin" />
          ) : (
            <Bookmark
              aria-hidden="true"
              className="size-[18px]"
              fill={isSaved ? "currentColor" : "none"}
              strokeWidth={1.8}
            />
          )}
          <span className="hidden sm:inline">{isSaved ? "Guardado" : "Guardar"}</span>
        </SocialActionButton>
      </div>

      <AppToast
        message={message?.text}
        onDismiss={() => setMessage(null)}
        tone={message?.kind === "pending" ? "info" : "error"}
      />
      {authModal}
    </>
  );
}

function logPostNotFound(
  error: unknown,
  postId: string,
  calculatedOrigin: "demo" | "persistent",
) {
  if (process.env.NODE_ENV !== "development" || !(error instanceof ApiError)) return;

  console.warn("Post interaction returned 404", {
    id: postId,
    endpoint: error.path,
    status: error.status,
    calculatedOrigin,
  });
}
