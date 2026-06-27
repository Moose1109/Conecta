"use client";

import { useState } from "react";
import { MockActionButton } from "@/components/social/mock-action-button";

export function SocialPostActions({
  storageKey,
  likes = 0,
  comments = 0,
  shares = 0,
  saved = false,
}: {
  storageKey?: string;
  likes?: number;
  comments?: number;
  shares?: number;
  saved?: boolean;
}) {
  const likeKey = storageKey ? `cp:post:${storageKey}:liked` : undefined;
  const saveKey = storageKey ? `cp:post:${storageKey}:saved` : undefined;
  const [liked, setLiked] = useState(() => {
    if (typeof window === "undefined" || !likeKey) {
      return false;
    }

    return window.localStorage.getItem(likeKey) === "true";
  });
  const [isSaved, setIsSaved] = useState(() => {
    if (typeof window === "undefined" || !saveKey) {
      return saved;
    }

    return window.localStorage.getItem(saveKey) === "true" || saved;
  });

  function toggleLiked() {
    setLiked((value) => {
      const next = !value;
      if (likeKey) {
        window.localStorage.setItem(likeKey, String(next));
      }
      return next;
    });
  }

  function toggleSaved() {
    setIsSaved((value) => {
      const next = !value;
      if (saveKey) {
        window.localStorage.setItem(saveKey, String(next));
      }
      return next;
    });
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#1F3D2B12] px-3 py-2">
      <MockActionButton
        aria-pressed={liked}
        className={liked ? "bg-[#D9A44124] text-[#1F3D2B]" : undefined}
        onClick={toggleLiked}
      >
        Me gusta {liked ? likes + 1 : likes}
      </MockActionButton>
      <MockActionButton>Comentar {comments}</MockActionButton>
      <MockActionButton>Compartir {shares}</MockActionButton>
      <MockActionButton
        aria-pressed={isSaved}
        className={isSaved ? "bg-[#1F3D2B] text-white hover:bg-[#1F3D2B]" : undefined}
        onClick={toggleSaved}
      >
        {isSaved ? "Guardado" : "Guardar"}
      </MockActionButton>
    </div>
  );
}
