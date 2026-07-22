"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  ImagePlus,
  Info,
  Megaphone,
  Send,
  X,
} from "lucide-react";
import { FormEvent, useState } from "react";
import { SocialActionButton } from "@/components/social/social-action-button";
import { UserAvatar } from "@/components/social/user-avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuthGuard } from "@/features/auth/use-auth-guard";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { requestCommunityDataRefresh } from "@/features/community/community-events";
import { isUnauthorizedError } from "@/lib/api/client";
import { createCommunityPost } from "@/lib/api/community.service";
import { isPersistedVillage } from "@/lib/api/entity-capabilities";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { clearSession, getStoredToken } from "@/lib/api/session";
import { isRenderableImageUrl } from "@/lib/image-url";
import { cn } from "@/lib/utils";
import type { AuthUser, Village } from "@/lib/types";

type ComposerUser = {
  name: string;
  avatar?: string;
  avatarUrl?: AuthUser["avatarUrl"];
};

type ComposerMessage = {
  kind: "error" | "pending" | "success";
  text: string;
};

type PendingComposerAction = "foto" | "aviso" | "encuesta";

const pendingMessages: Record<PendingComposerAction, string> = {
  foto:
    "Fotos y vídeo estarán disponibles cuando el servicio permita subir archivos. Puedes publicar el texto ahora.",
  aviso:
    "Los avisos con formato propio están preparados en el frontend y necesitan soporte del servicio para publicarse.",
  encuesta:
    "Las encuestas estarán disponibles cuando el servicio incorpore preguntas y opciones de respuesta.",
};

export function PostComposer({
  user,
  villages = [],
  demoFeed = false,
}: {
  user: ComposerUser;
  villages?: Village[];
  demoFeed?: boolean;
}) {
  const router = useRouter();
  const { user: sessionUser } = useAuthSession();
  const displayUser = sessionUser ?? user;
  const [content, setContent] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState<ComposerMessage | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { authModal, requireAuth } = useAuthGuard();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const form = event.currentTarget;

    const token = getStoredToken();

    if (!token) {
      requireAuth("Para publicar en la comunidad necesitas iniciar sesión.", () => undefined);
      return;
    }

    const formData = new FormData(form);
    const title = String(formData.get("title") ?? "").trim();
    const villageId = String(formData.get("villageId") ?? "").trim();
    const imageUrl = String(formData.get("imageUrl") ?? "").trim();
    const cleanContent = content.trim();
    const selectedVillage = villages.find((village) => village.id === villageId);

    if (cleanContent.length < 2) {
      setMessage({ kind: "error", text: "La publicación debe tener al menos 2 caracteres." });
      setExpanded(true);
      return;
    }

    if (title && title.length < 2) {
      setMessage({ kind: "error", text: "El título debe tener al menos 2 caracteres o quedar vacío." });
      setExpanded(true);
      return;
    }

    if (title.length > 180) {
      setMessage({ kind: "error", text: "El título no puede superar 180 caracteres." });
      setExpanded(true);
      return;
    }

    if (imageUrl && !isRenderableImageUrl(imageUrl)) {
      setMessage({
        kind: "error",
        text: "La imagen debe usar una URL http(s) de un origen configurado.",
      });
      setExpanded(true);
      return;
    }

    if (selectedVillage && !isPersistedVillage(selectedVillage)) {
      setMessage({
        kind: "pending",
        text: "Este pueblo pertenece a los datos de demostración y no puede asociarse a una publicación persistente.",
      });
      setExpanded(true);
      return;
    }

    try {
      setIsSubmitting(true);
      await createCommunityPost(
        {
          title: title || null,
          village_id: villageId || null,
          content: cleanContent,
          image_url: imageUrl || null,
        },
        token,
      );
      setMessage({
        kind: "success",
        text: demoFeed
          ? "La publicación fue creada correctamente, pero el listado actual utiliza datos de demostración. Para verla en el feed real, la API debe ejecutarse sin modo mock."
          : "Publicación creada y enviada a la comunidad.",
      });
      setContent("");
      setExpanded(false);
      form.reset();
      requestCommunityDataRefresh();
      router.refresh();
    } catch (error) {
      if (isUnauthorizedError(error)) {
        clearSession();
        setMessage({
          kind: "error",
          text: "Tu sesión ha caducado. Vuelve a iniciar sesión para publicar.",
        });
      } else {
        setMessage({
          kind: "error",
          text: getApiErrorMessage(
            error,
            "No se pudo publicar. Comprueba los datos e inténtalo de nuevo.",
          ),
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function showPendingComposerAction(action: PendingComposerAction) {
    const authMessage =
      action === "foto"
        ? "Para subir fotos necesitas iniciar sesión."
        : action === "aviso"
          ? "Para crear avisos necesitas iniciar sesión."
          : "Para crear encuestas necesitas iniciar sesión.";

    requireAuth(authMessage, () => {
      setMessage({ kind: "pending", text: pendingMessages[action] });
    });
  }

  const messageStyles = {
    error: "border-[#C96D4A33] bg-[#C96D4A12] text-[#873E29]",
    pending: "border-[#D7A63C3d] bg-[#D7A63C14] text-[#72551C]",
    success: "border-[#347A4833] bg-[#347A4810] text-[#184B34]",
  } satisfies Record<ComposerMessage["kind"], string>;
  const MessageIcon =
    message?.kind === "success" ? CheckCircle2 : message?.kind === "pending" ? Info : CircleAlert;

  return (
    <>
      <Card className="scroll-mt-28 overflow-hidden" id="publicar">
        <form onSubmit={handleSubmit}>
          <div className="p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <UserAvatar
                name={displayUser.name}
                initials={"avatar" in displayUser ? displayUser.avatar : undefined}
                imageUrl={displayUser.avatarUrl}
                className="mt-0.5 size-12 ring-2 ring-white sm:size-[52px]"
              />
              <label className="min-w-0 flex-1">
                <span className="sr-only">Contenido de la publicación</span>
                <textarea
                  className={cn(
                    "block min-h-14 w-full resize-none rounded-[22px] border border-[#184B3412] bg-[#F3F0E9] px-5 py-4 text-sm font-medium leading-6 text-[#18231D] outline-none transition-all duration-200 placeholder:text-[#687269]/82 hover:bg-[#F0EDE5] focus:border-[#347A4830] focus:bg-white focus:ring-4 focus:ring-[#347A4816] sm:text-[15px]",
                    expanded && "min-h-24 rounded-[18px]",
                  )}
                  name="content"
                  onChange={(event) => {
                    setContent(event.target.value);
                    if (!expanded) {
                      setExpanded(true);
                    }
                  }}
                  onFocus={() => setExpanded(true)}
                  placeholder="¿Qué está pasando en tu pueblo?"
                  value={content}
                />
              </label>
            </div>

            {expanded ? (
              <div className="mt-3 grid gap-3">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_210px]">
                  <label>
                    <span className="sr-only">Título opcional</span>
                    <input
                      className="field min-h-11 rounded-[14px] py-2.5 text-sm"
                      maxLength={180}
                      minLength={2}
                      name="title"
                      placeholder="Añade un título (opcional)"
                    />
                  </label>
                  <label>
                    <span className="sr-only">Pueblo relacionado</span>
                    <select
                      className="field min-h-11 rounded-[14px] py-2.5 text-sm"
                      defaultValue=""
                      name="villageId"
                    >
                      <option value="">Sin pueblo asociado</option>
                      {villages.map((village) => (
                        <option
                          disabled={!isPersistedVillage(village)}
                          key={village.id}
                          value={village.id}
                        >
                          {village.name}{village.dataSource === "demo" ? " (demostración)" : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <label>
                  <span className="sr-only">URL de imagen opcional</span>
                  <input
                    className="field min-h-11 rounded-[14px] py-2.5 text-sm"
                    inputMode="url"
                    name="imageUrl"
                    placeholder="URL de imagen (opcional)"
                    type="url"
                  />
                </label>
              </div>
            ) : null}
          </div>

          <div className="border-t border-[#184B3412] bg-white/36 p-2 sm:flex sm:items-center sm:justify-between sm:gap-2">
            <div className="grid grid-cols-2 gap-1 sm:flex sm:min-w-0 sm:flex-1">
              <SocialActionButton
                className="justify-start text-[#435048]"
                onClick={() => showPendingComposerAction("foto")}
                type="button"
              >
                <ImagePlus aria-hidden="true" className="size-[18px] text-[#347A48]" />
                Foto/vídeo
              </SocialActionButton>
              <Link
                className="inline-flex min-h-11 items-center justify-start gap-2 rounded-xl px-3 text-xs font-extrabold text-[#435048] transition-colors hover:bg-[#184B3409] hover:text-[#184B34] sm:text-[13px]"
                href="/activities/create"
              >
                <CalendarDays aria-hidden="true" className="size-[18px] text-[#D7A63C]" />
                Actividad
              </Link>
              <SocialActionButton
                className="justify-start text-[#435048]"
                onClick={() => showPendingComposerAction("aviso")}
                type="button"
              >
                <Megaphone aria-hidden="true" className="size-[18px] text-[#C96D4A]" />
                Aviso
              </SocialActionButton>
              <SocialActionButton
                className="justify-start text-[#435048]"
                onClick={() => showPendingComposerAction("encuesta")}
                type="button"
              >
                <BarChart3 aria-hidden="true" className="size-[18px] text-[#60818A]" />
                Encuesta
              </SocialActionButton>
            </div>
            <Button
              className="mt-2 w-full shrink-0 px-5 sm:mt-0 sm:w-auto"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Publicando..." : "Publicar"}
              <Send aria-hidden="true" className="size-4" />
            </Button>
          </div>

          {message ? (
            <div className="px-3 pb-3 sm:px-4">
              <div
                className={cn(
                  "flex items-start gap-2.5 rounded-2xl border px-3.5 py-3 text-xs font-semibold leading-5",
                  messageStyles[message.kind],
                )}
                role={message.kind === "error" ? "alert" : "status"}
              >
                <MessageIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
                <p className="min-w-0 flex-1">{message.text}</p>
                <button
                  aria-label="Cerrar mensaje"
                  className="grid size-11 shrink-0 place-items-center rounded-full hover:bg-black/5"
                  onClick={() => setMessage(null)}
                  type="button"
                >
                  <X aria-hidden="true" className="size-3.5" />
                </button>
              </div>
            </div>
          ) : null}
        </form>
      </Card>
      {authModal}
    </>
  );
}
