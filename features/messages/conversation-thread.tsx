"use client";

import Image from "next/image";
import {
  ArrowLeft,
  CalendarDays,
  CheckCheck,
  Info,
  Landmark,
  MapPin,
  MoreHorizontal,
  Paperclip,
  Send,
  UsersRound,
  X,
} from "lucide-react";
import {
  type FormEvent,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { UserAvatar } from "@/components/social/user-avatar";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Button } from "@/components/ui/button";
import {
  type ConceptConversation,
  type ConceptMessage,
  type ConceptSharedResource,
} from "@/features/messages/messages-concept-data";
import { cn } from "@/lib/utils";

export type ThreadPendingAction = "attachment" | "more" | "send";

const pendingContent: Record<ThreadPendingAction, { description: string; title: string }> = {
  attachment: {
    description: "Adjuntar archivos requiere validación, límites de tamaño y almacenamiento backend. No se ha abierto ningún selector ni subido ningún archivo.",
    title: "Adjuntos no disponibles",
  },
  more: {
    description: "Bloqueo, reportes y moderación necesitan autorización real en el backend. Ninguna acción se ha ejecutado.",
    title: "Acciones de confianza pendientes",
  },
  send: {
    description: "El borrador permanece en el compositor porque no existe un endpoint de mensajes. No se ha enviado, guardado ni añadido nada al historial.",
    title: "Envío no disponible",
  },
};

const kindLabels: Record<ConceptConversation["kind"], string> = {
  activity: "Actividad conceptual",
  community: "Grupo comunitario conceptual",
  individual: "Conversación individual conceptual",
  village: "Pueblo conceptual",
};

export function ConversationThread({
  conversation,
  detailsOpen,
  headingRef,
  onBack,
  onClearSelection,
  onPendingAction,
  onToggleDetails,
  pendingAction,
}: {
  conversation: ConceptConversation;
  detailsOpen: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onBack: () => void;
  onClearSelection: () => void;
  onPendingAction: (action: ThreadPendingAction) => void;
  onToggleDetails: () => void;
  pendingAction?: ThreadPendingAction;
}) {
  const [draft, setDraft] = useState("");
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const history = historyRef.current;
    if (history) history.scrollTop = history.scrollHeight;
  }, [conversation.id]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.trim()) return;
    onPendingAction("send");
  }

  return (
    <section
      aria-labelledby="active-conversation-title"
      className="flex h-full min-h-0 min-w-0 flex-col bg-[#FBFAF7]"
    >
      <header className="flex min-w-0 shrink-0 items-center gap-2 border-b border-border bg-white px-3 py-3 sm:px-4">
        <button
          aria-label="Volver a la lista de conversaciones"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-white text-primary shadow-sm md:hidden"
          type="button"
          onClick={onBack}
        >
          <ArrowLeft aria-hidden="true" className="size-5" />
        </button>
        <UserAvatar
          className="size-11 ring-2 ring-white sm:size-12"
          initials={conversation.initials}
          name={`${conversation.name}, identidad conceptual`}
        />
        <div className="min-w-0 flex-1">
          <h2
            ref={headingRef}
            className="line-clamp-2 text-sm font-extrabold leading-5 text-text-primary outline-none sm:text-base"
            id="active-conversation-title"
            tabIndex={-1}
          >
            {conversation.name}
          </h2>
          <p className="mt-0.5 truncate text-[11px] font-semibold text-forest-mid">
            {conversation.status}
          </p>
        </div>
        <button
          aria-controls="conversation-concept-details"
          aria-expanded={detailsOpen}
          aria-label={detailsOpen ? "Ocultar información conceptual" : "Mostrar información conceptual"}
          className={cn(
            "grid size-11 shrink-0 place-items-center rounded-full border border-border bg-white text-primary transition-colors hover:bg-[#F5F6F1]",
            detailsOpen && "bg-[#EEF3EC]",
          )}
          type="button"
          onClick={onToggleDetails}
        >
          <Info aria-hidden="true" className="size-5" />
        </button>
        <button
          aria-label="Mostrar dependencia de acciones de confianza"
          className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-white text-primary transition-colors hover:bg-[#F5F6F1]"
          title="Reportar o bloquear · requiere backend"
          type="button"
          onClick={() => onPendingAction("more")}
        >
          <MoreHorizontal aria-hidden="true" className="size-5" />
        </button>
        <button
          aria-label="Cerrar conversación seleccionada"
          className="hidden size-11 shrink-0 place-items-center rounded-full border border-border bg-white text-text-muted transition-colors hover:text-primary md:grid"
          title="Cerrar conversación"
          type="button"
          onClick={onClearSelection}
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </header>

      {detailsOpen ? (
        <section
          className="shrink-0 border-b border-border bg-[#F4F6F1] px-4 py-3 sm:px-5"
          id="conversation-concept-details"
        >
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-primary shadow-sm">
              {conversation.kind === "activity" ? (
                <CalendarDays aria-hidden="true" className="size-5" />
              ) : conversation.kind === "individual" ? (
                <UsersRound aria-hidden="true" className="size-5" />
              ) : (
                <MapPin aria-hidden="true" className="size-5" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-extrabold text-primary">{kindLabels[conversation.kind]}</p>
              <p className="mt-1 text-xs leading-5 text-text-muted">{conversation.about}</p>
            </div>
            <button
              aria-label="Cerrar información conceptual"
              className="grid size-11 shrink-0 place-items-center rounded-full text-text-muted hover:bg-white hover:text-primary"
              type="button"
              onClick={onToggleDetails}
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        </section>
      ) : null}

      <div
        ref={historyRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-5 sm:py-5"
        tabIndex={0}
      >
        <ol aria-label={`Historial conceptual de ${conversation.name}`} className="mx-auto grid w-full max-w-3xl gap-5">
          {conversation.days.map((day) => (
            <li key={day.label}>
              <div className="mb-4 flex items-center gap-3" role="separator">
                <span aria-hidden="true" className="h-px flex-1 bg-border" />
                <span className="rounded-full border border-border bg-white px-3 py-1 text-[11px] font-bold text-text-muted">
                  {day.label}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-border" />
              </div>
              <ul className="grid gap-3">
                {day.messages.map((message) => (
                  <li className="min-w-0" key={message.id}>
                    <MessageBubble message={message} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <div className="shrink-0 border-t border-border bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-4 md:pb-3">
        {pendingAction ? (
          <BackendPendingAlert
            compact
            className="mx-auto mb-3 max-w-3xl"
            description={pendingContent[pendingAction].description}
            title={pendingContent[pendingAction].title}
          />
        ) : null}
        <form className="mx-auto flex max-w-3xl items-end gap-2" onSubmit={handleSubmit}>
          <button
            aria-label="Mostrar dependencia para adjuntar un archivo"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-[#FBFAF7] text-primary transition-colors hover:bg-[#F4F6F1]"
            title="Adjuntar · requiere backend"
            type="button"
            onClick={() => onPendingAction("attachment")}
          >
            <Paperclip aria-hidden="true" className="size-5" />
          </button>
          <label className="min-w-0 flex-1">
            <span className="sr-only">Borrador conceptual del mensaje</span>
            <textarea
              className="min-h-11 max-h-28 w-full resize-none rounded-[22px] border border-border bg-[#FBFAF7] px-4 py-2.5 text-sm leading-6 text-text-primary outline-none transition focus:border-forest-mid focus:bg-white focus:ring-4 focus:ring-[#347A4818]"
              placeholder="Escribe un mensaje de ejemplo..."
              rows={1}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          </label>
          <button
            aria-label="Intentar enviar el borrador conceptual"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_22px_rgba(24,75,52,0.2)] transition-colors hover:bg-forest-deep disabled:bg-[#78947D]"
            disabled={!draft.trim()}
            title={draft.trim() ? "Mostrar dependencia de envío" : "Escribe un borrador para probar el estado pendiente"}
            type="submit"
          >
            <Send aria-hidden="true" className="size-5" />
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-3xl text-center text-[10px] font-semibold text-text-muted">
          Vista conceptual: escribir no guarda ni envía contenido.
        </p>
      </div>
    </section>
  );
}

function MessageBubble({ message }: { message: ConceptMessage }) {
  const outgoing = message.direction === "outgoing";

  return (
    <article
      aria-label={`${outgoing ? "Mensaje saliente" : "Mensaje entrante"} conceptual a las ${message.time}`}
      className={cn(
        "w-fit min-w-0 max-w-[88%] rounded-[20px] border px-4 py-3 shadow-[0_8px_22px_rgba(43,55,38,0.045)] sm:max-w-[78%]",
        outgoing
          ? "ml-auto border-[#347A4818] bg-[#EEF3EC]"
          : "mr-auto border-border bg-white",
        message.sharedResource && "w-full max-w-[92%] p-2 sm:max-w-[82%]",
      )}
    >
      {message.sender && !outgoing ? (
        <p className="mb-1 text-[11px] font-extrabold text-forest-mid">{message.sender}</p>
      ) : null}
      {message.content ? (
        <p className="break-words text-sm leading-6 text-text-primary sm:text-[15px]">
          {message.content}
        </p>
      ) : null}
      {message.sharedResource ? <SharedContentCard resource={message.sharedResource} /> : null}
      <div className={cn("mt-1.5 flex items-center justify-end gap-1.5 text-[10px] font-semibold text-text-muted", message.sharedResource && "px-2") }>
        <span>{message.time}</span>
        {message.readState ? (
          <span aria-label={message.readState} className="inline-flex items-center gap-1 text-forest-mid">
            <CheckCheck aria-hidden="true" className="size-3.5" />
            <span className="sr-only">{message.readState}</span>
          </span>
        ) : null}
      </div>
    </article>
  );
}

function SharedContentCard({ resource }: { resource: ConceptSharedResource }) {
  return (
    <div className="overflow-hidden rounded-[16px] border border-border bg-[#FFFCF7]">
      <div className="grid min-w-0 grid-cols-[88px_minmax(0,1fr)] sm:grid-cols-[116px_minmax(0,1fr)]">
        <div className="relative min-h-28 bg-[#E7E5DE]">
          <Image
            alt={`Imagen local de ejemplo para ${resource.title}`}
            className="object-cover"
            fill
            loading="eager"
            sizes="116px"
            src={resource.image}
          />
          <span className="absolute left-2 top-2 rounded-full bg-white/92 px-2 py-1 text-[9px] font-black uppercase tracking-[0.08em] text-primary shadow-sm">
            Ejemplo
          </span>
        </div>
        <div className="min-w-0 p-3">
          <p className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.1em] text-forest-mid">
            {resource.type === "activity" ? (
              <CalendarDays aria-hidden="true" className="size-3.5" />
            ) : (
              <Landmark aria-hidden="true" className="size-3.5" />
            )}
            {resource.type === "activity" ? "Actividad conceptual" : "Pueblo conceptual"}
          </p>
          <p className="mt-1 line-clamp-2 text-xs font-extrabold leading-5 text-text-primary sm:text-sm">
            {resource.title}
          </p>
          <p className="mt-1 hidden text-[11px] leading-4 text-text-muted sm:line-clamp-2">
            {resource.description}
          </p>
          <div className="mt-2 grid gap-1 text-[10px] font-semibold text-text-muted">
            {resource.meta.map((item, index) => (
              <span className="flex min-w-0 items-center gap-1.5" key={item}>
                {index === 0 ? <CalendarDays aria-hidden="true" className="size-3" /> : <MapPin aria-hidden="true" className="size-3" />}
                <span className="truncate">{item}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-border p-2">
        <Button
          className="min-h-10 w-full py-2 text-xs"
          disabled
          type="button"
          variant="secondary"
        >
          Ver {resource.type === "activity" ? "actividad" : "pueblo"}
          <span className="sr-only">, recurso conceptual sin identificador ni ruta persistente</span>
        </Button>
      </div>
    </div>
  );
}
