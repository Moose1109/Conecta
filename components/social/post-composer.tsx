"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { SocialActionButton } from "@/components/social/social-action-button";
import { UserAvatar } from "@/components/social/user-avatar";
import { useAuthGuard } from "@/features/auth/use-auth-guard";
import { isUnauthorizedError } from "@/lib/api/client";
import { createCommunityPost } from "@/lib/api/community.service";
import { clearSession, getStoredToken } from "@/lib/api/session";
import { useAuthSession } from "@/features/auth/use-auth-session";
import type { AuthUser, Village } from "@/lib/types";

type ComposerUser = {
  name: string;
  avatar?: string;
  avatarUrl?: AuthUser["avatarUrl"];
};

export function PostComposer({
  user,
  villages = [],
}: {
  user: ComposerUser;
  villages?: Village[];
}) {
  const router = useRouter();
  const { user: sessionUser } = useAuthSession();
  const displayUser = sessionUser ?? user;
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authModal, requireAuth } = useAuthGuard();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const token = getStoredToken();

    if (!token) {
      requireAuth("Para publicar en la comunidad necesitas iniciar sesión.", () => undefined);
      return;
    }

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const villageId = String(formData.get("villageId") ?? "").trim();
    const content = String(formData.get("content") ?? "").trim();

    if (!content) {
      setError("Escribe una publicación antes de enviarla.");
      return;
    }

    try {
      setIsSubmitting(true);
      await createCommunityPost(
        {
          title: title || null,
          village_id: villageId || null,
          content,
        },
        token,
      );
      setSuccess("Publicación creada.");
      event.currentTarget.reset();
      router.refresh();
    } catch (error) {
      console.error("Error creating post:", error);
      if (isUnauthorizedError(error)) {
        clearSession();
        setError("Tu sesión ha caducado. Vuelve a iniciar sesión para publicar.");
      } else {
        setError("No se pudo publicar. Revisa la sesión o inténtalo de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function showPendingComposerAction(action: "foto" | "aviso") {
    requireAuth(
      action === "foto"
        ? "Para subir fotos necesitas iniciar sesión."
        : "Para crear avisos necesitas iniciar sesión.",
      () => {
        setSuccess("");
        setError(
          action === "foto"
            ? "Funcionalidad pendiente: falta crear el endpoint para subir fotos."
            : "Funcionalidad pendiente: falta crear el endpoint para publicar avisos.",
        );
      },
    );
  }

  return (
    <>
      <Card className="p-4 sm:p-5">
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <UserAvatar
              name={displayUser.name}
              initials={"avatar" in displayUser ? displayUser.avatar : undefined}
              imageUrl={displayUser.avatarUrl}
            />
            <textarea
              className="min-h-12 flex-1 resize-y rounded-3xl bg-[#F3F4F6] px-5 py-3 text-sm font-bold text-[#1E1E1E]/72 transition-colors placeholder:text-[#1E1E1E]/52 hover:bg-[#ECEFEA] focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]"
              name="content"
              placeholder="¿Qué está pasando en tu pueblo?"
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
            <input className="field" name="title" placeholder="Título opcional" />
            <select className="field" name="villageId" defaultValue="">
              <option value="">Sin pueblo asociado</option>
              {villages.map((village) => (
                <option key={village.id} value={village.id}>
                  {village.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-[#1F3D2B12] pt-3">
            <SocialActionButton disabled={isSubmitting} type="submit">
              {isSubmitting ? "Publicando..." : "Publicar"}
            </SocialActionButton>
            <SocialActionButton type="button" onClick={() => showPendingComposerAction("foto")}>
              Foto
            </SocialActionButton>
            <SocialActionButton type="button" onClick={() => showPendingComposerAction("aviso")}>
              Aviso
            </SocialActionButton>
          </div>
          {error ? (
            <p className="text-sm font-bold text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="text-sm font-bold text-[#3A7D44]" role="status">
              {success}
            </p>
          ) : null}
        </form>
      </Card>
      {authModal}
    </>
  );
}
