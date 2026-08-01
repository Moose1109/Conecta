"use client";

import {
  type KeyboardEvent,
  type RefObject,
  useRef,
} from "react";
import { CalendarDays, MessageCirclePlus } from "lucide-react";
import { UserAvatar } from "@/components/social/user-avatar";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Badge } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import {
  conceptFilterLabels,
  conceptFilters,
  type ConceptConversation,
  type ConceptConversationFilter,
} from "@/features/messages/messages-concept-data";
import { cn } from "@/lib/utils";

export function ConversationsPanel({
  conversations,
  filter,
  listScrollRef,
  newConversationPending,
  onFilterChange,
  onNewConversation,
  onQueryChange,
  onSelect,
  query,
  registerRow,
  selectedId,
  unreadCount,
}: {
  conversations: ConceptConversation[];
  filter: ConceptConversationFilter;
  listScrollRef: RefObject<HTMLDivElement | null>;
  newConversationPending: boolean;
  onFilterChange: (filter: ConceptConversationFilter) => void;
  onNewConversation: () => void;
  onQueryChange: (value: string) => void;
  onSelect: (conversation: ConceptConversation) => void;
  query: string;
  registerRow: (id: string, element: HTMLButtonElement | null) => void;
  selectedId?: string;
  unreadCount: number;
}) {
  const tabRefs = useRef<Record<ConceptConversationFilter, HTMLButtonElement | null>>({
    activities: null,
    all: null,
    unread: null,
    villages: null,
  });

  function selectFilter(nextFilter: ConceptConversationFilter) {
    onFilterChange(nextFilter);
    tabRefs.current[nextFilter]?.focus();
  }

  function handleFilterKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    currentFilter: ConceptConversationFilter,
  ) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const currentIndex = conceptFilters.indexOf(currentFilter);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? conceptFilters.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + conceptFilters.length) % conceptFilters.length;
    selectFilter(conceptFilters[nextIndex]);
  }

  return (
    <section
      aria-labelledby="messages-title"
      className="flex h-full min-h-0 min-w-0 flex-col bg-white"
    >
      <div className="shrink-0 border-b border-border px-4 pb-4 pt-5 sm:px-5 md:px-4 xl:px-5 [@media(max-height:640px)]:pb-2 [@media(max-height:640px)]:pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Conversaciones</p>
            <h1
              className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-text-primary"
              id="messages-title"
            >
              Mensajes
            </h1>
            <p className="mt-2 text-xs font-semibold leading-5 text-text-muted [@media(max-height:640px)]:hidden">
              Contenido local de demostración, sin datos personales reales.
            </p>
          </div>
          <button
            aria-label="Mostrar dependencia para crear una conversación"
            className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-surface text-primary shadow-sm transition-colors hover:bg-white"
            title="Nueva conversación · requiere backend"
            type="button"
            onClick={onNewConversation}
          >
            <MessageCirclePlus aria-hidden="true" className="size-5" />
          </button>
        </div>

        <SearchInput
          appearance="embedded"
          className="mt-4 rounded-[18px] border border-border bg-[#FBFAF7] shadow-sm [@media(max-height:640px)]:mt-2"
          id="messages-concept-search"
          label="Buscar en las conversaciones conceptuales"
          placeholder="Buscar conversaciones..."
          value={query}
          onChange={onQueryChange}
          onClear={() => onQueryChange("")}
        />

        <div
          aria-label="Filtros de conversaciones conceptuales"
          className="mt-3 flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [@media(max-height:640px)]:mt-2"
          role="tablist"
        >
          {conceptFilters.map((item) => {
            const selected = item === filter;

            return (
              <button
                key={item}
                ref={(element) => {
                  tabRefs.current[item] = element;
                }}
                aria-controls="messages-concept-list"
                aria-selected={selected}
                className={cn(
                  "inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-xs font-extrabold transition-colors",
                  selected
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-white text-text-muted hover:border-[#184B3430] hover:text-primary",
                )}
                id={`messages-filter-${item}`}
                role="tab"
                tabIndex={selected ? 0 : -1}
                type="button"
                onClick={() => onFilterChange(item)}
                onKeyDown={(event) => handleFilterKeyDown(event, item)}
              >
                {item === "activities" ? <CalendarDays aria-hidden="true" className="size-4" /> : null}
                {conceptFilterLabels[item]}
                {item === "unread" && unreadCount ? (
                  <Badge className={cn("px-2 py-0.5", selected && "bg-white/18 text-white")}>
                    {unreadCount}
                  </Badge>
                ) : null}
              </button>
            );
          })}
        </div>

        {newConversationPending ? (
          <BackendPendingAlert
            compact
            className="mt-3"
            description="Crear una conversación necesita participantes, autorización y persistencia en el backend. No se ha creado ningún hilo."
            title="Nueva conversación no disponible"
          />
        ) : null}
      </div>

      <div
        ref={listScrollRef}
        aria-labelledby={`messages-filter-${filter}`}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2 sm:p-3"
        id="messages-concept-list"
        role="tabpanel"
        tabIndex={0}
      >
        {conversations.length ? (
          <ul aria-label="Conversaciones de ejemplo" className="grid gap-1.5">
            {conversations.map((conversation) => {
              const selected = conversation.id === selectedId;

              return (
                <li key={conversation.id}>
                  <button
                    ref={(element) => registerRow(conversation.id, element)}
                    aria-current={selected ? "true" : undefined}
                    className={cn(
                      "grid min-h-[104px] w-full min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[18px] border px-3 py-3 text-left transition-colors focus-visible:z-10",
                      selected
                        ? "border-[#347A4828] bg-[#EEF3EC] shadow-sm"
                        : "border-transparent bg-white hover:border-border hover:bg-[#FBFAF7]",
                    )}
                    type="button"
                    onClick={() => onSelect(conversation)}
                  >
                    <UserAvatar
                      className={cn(
                        "size-12 ring-2 ring-white",
                        conversation.kind === "activity" && "bg-[#F2E3BC] text-[#765A18]",
                        conversation.kind === "community" && "bg-[#DDE8DD] text-primary",
                        conversation.kind === "individual" && "bg-[#E7E4DC] text-[#435048]",
                      )}
                      initials={conversation.initials}
                      name={`${conversation.name}, identidad conceptual`}
                    />
                    <span className="min-w-0">
                      <span className="line-clamp-2 text-sm font-extrabold leading-5 text-text-primary">
                        {conversation.name}
                      </span>
                      <span className="mt-0.5 block truncate text-[11px] font-bold text-forest-mid">
                        {conversation.context}
                      </span>
                      <span className="mt-1 line-clamp-2 text-xs leading-5 text-text-muted">
                        {conversation.lastMessage}
                      </span>
                    </span>
                    <span className="flex h-full min-w-8 flex-col items-end justify-between gap-2 py-0.5 text-[11px] font-semibold text-text-muted">
                      <span>{conversation.timeLabel}</span>
                      {conversation.unreadCount ? (
                        <span
                          aria-label={`${conversation.unreadCount} mensajes conceptuales no leídos`}
                          className="grid size-7 place-items-center rounded-full bg-primary text-xs font-extrabold text-white"
                        >
                          {conversation.unreadCount}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="grid min-h-full place-items-center px-4 py-8 text-center">
            <div className="max-w-xs">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#78947D1f] text-primary">
                <MessageCirclePlus aria-hidden="true" className="size-6" />
              </span>
              <h2 className="mt-4 text-lg font-extrabold text-text-primary">
                {query ? "Sin resultados en la propuesta" : "Este filtro no tiene ejemplos"}
              </h2>
              <p className="mt-2 text-xs leading-5 text-text-muted">
                {query
                  ? `No hay conversaciones conceptuales que coincidan con “${query}”.`
                  : "Prueba otro filtro para continuar recorriendo la demostración."}
              </p>
              {query ? (
                <button
                  className="mt-4 min-h-11 rounded-full px-4 text-sm font-extrabold text-primary hover:bg-[#184B340a]"
                  type="button"
                  onClick={() => onQueryChange("")}
                >
                  Limpiar búsqueda
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
