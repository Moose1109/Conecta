"use client";

import { useState } from "react";
import { MockActionButton } from "@/components/social/mock-action-button";

export function SocialPostActions({
  likes = 0,
  comments = 0,
  shares = 0,
  saved = false,
}: {
  likes?: number;
  comments?: number;
  shares?: number;
  saved?: boolean;
}) {
  const [liked, setLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(saved);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#1F3D2B12] px-3 py-2">
      <MockActionButton
        aria-pressed={liked}
        className={liked ? "bg-[#D9A44124] text-[#1F3D2B]" : undefined}
        onClick={() => setLiked((value) => !value)}
      >
        Me gusta {liked ? likes + 1 : likes}
      </MockActionButton>
      <MockActionButton>Comentar {comments}</MockActionButton>
      <MockActionButton>Compartir {shares}</MockActionButton>
      <MockActionButton
        aria-pressed={isSaved}
        className={isSaved ? "bg-[#1F3D2B] text-white hover:bg-[#1F3D2B]" : undefined}
        onClick={() => setIsSaved((value) => !value)}
      >
        {isSaved ? "Guardado" : "Guardar"}
      </MockActionButton>
    </div>
  );
}
