"use client";

import {
  AlertTriangle,
  LoaderCircle,
  MessageCircle,
  MessageSquareText,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Card } from "@/components/ui/card";
import { PrototypeBanner } from "@/components/ui/prototype-banner";
import { useTranslations } from "@/components/i18n/i18n-provider";
import {
  ConversationThread,
  type ThreadPendingAction,
} from "@/features/messages/conversation-thread";
import { ConversationsPanel } from "@/features/messages/conversations-panel";
import {
  messagesConceptConversations,
  type ConceptConversation,
  type ConceptConversationFilter,
  type MessagesConceptState,
} from "@/features/messages/messages-concept-data";
import { cn } from "@/lib/utils";

function isMobileMessagesLayout() {
  return window.matchMedia("(max-width: 767px)").matches;
}

export function MessagesView({
  initialState = "ready",
}: {
  initialState?: MessagesConceptState;
}) {
  const { t } = useTranslations();
  const [filter, setFilter] = useState<ConceptConversationFilter>("all");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>(
    messagesConceptConversations[0]?.id,
  );
  const [mobileThreadOpen, setMobileThreadOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newConversationPending, setNewConversationPending] = useState(false);
  const [threadPendingAction, setThreadPendingAction] = useState<ThreadPendingAction>();
  const listScrollRef = useRef<HTMLDivElement>(null);
  const threadHeadingRef = useRef<HTMLHeadingElement>(null);
  const conversationRows = useRef(new Map<string, HTMLButtonElement>());

  const normalizedQuery = query.trim().toLocaleLowerCase("es");
  const filteredConversations = useMemo(() => {
    return messagesConceptConversations.filter((conversation) => {
      const matchesFilter = filter === "all"
        || (filter === "unread" && conversation.unreadCount > 0)
        || (filter === "activities" && conversation.kind === "activity")
        || (filter === "villages" && conversation.kind === "village");
      const searchableText = [
        conversation.name,
        conversation.context,
        conversation.lastMessage,
      ].join(" ").toLocaleLowerCase("es");

      return matchesFilter && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [filter, normalizedQuery]);
  const selectedConversation = messagesConceptConversations.find(
    (conversation) => conversation.id === selectedId,
  );
  const unreadCount = messagesConceptConversations.reduce(
    (total, conversation) => total + conversation.unreadCount,
    0,
  );

  function registerRow(id: string, element: HTMLButtonElement | null) {
    if (element) conversationRows.current.set(id, element);
    else conversationRows.current.delete(id);
  }

  function selectConversation(conversation: ConceptConversation) {
    setSelectedId(conversation.id);
    setDetailsOpen(false);
    setThreadPendingAction(undefined);
    setNewConversationPending(false);
    setMobileThreadOpen(true);

    if (isMobileMessagesLayout()) {
      window.requestAnimationFrame(() => threadHeadingRef.current?.focus({ preventScroll: true }));
    }
  }

  function returnToList() {
    setMobileThreadOpen(false);
    setDetailsOpen(false);
    const row = selectedId ? conversationRows.current.get(selectedId) : undefined;
    window.requestAnimationFrame(() => row?.focus({ preventScroll: true }));
  }

  function clearSelection() {
    setSelectedId(undefined);
    setDetailsOpen(false);
    setThreadPendingAction(undefined);
  }

  function handleWorkspaceKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === "Escape" && mobileThreadOpen && isMobileMessagesLayout()) {
      event.preventDefault();
      returnToList();
    }
  }

  if (initialState !== "ready") {
    return <MessagesConceptStateView state={initialState} />;
  }

  return (
    <section
      aria-label={t("messages.ariaProposal")}
      className="flex h-[calc(100dvh-var(--topbar-height)-6.25rem-env(safe-area-inset-bottom))] min-h-0 min-w-0 flex-col gap-3 md:h-[calc(100dvh-var(--topbar-height)-2.5rem)] lg:h-[calc(100dvh-var(--topbar-height)-3rem)]"
      onKeyDown={handleWorkspaceKeyDown}
    >
      <MessagesConceptBanner />
      <Card className="min-h-0 min-w-0 flex-1 overflow-hidden rounded-[24px] bg-white/96 backdrop-blur-none">
        <div className="grid h-full min-h-0 min-w-0 md:grid-cols-[minmax(270px,0.78fr)_minmax(380px,1.35fr)]">
          <div className={cn("min-h-0 min-w-0 md:block", mobileThreadOpen ? "hidden" : "block")}>
            <ConversationsPanel
              conversations={filteredConversations}
              filter={filter}
              listScrollRef={listScrollRef}
              newConversationPending={newConversationPending}
              query={query}
              registerRow={registerRow}
              selectedId={selectedId}
              unreadCount={unreadCount}
              onFilterChange={(nextFilter) => {
                setFilter(nextFilter);
                setNewConversationPending(false);
              }}
              onNewConversation={() => {
                setNewConversationPending(true);
                setThreadPendingAction(undefined);
              }}
              onQueryChange={(value) => {
                setQuery(value);
                setNewConversationPending(false);
              }}
              onSelect={selectConversation}
            />
          </div>

          <div className={cn("min-h-0 min-w-0 border-l border-border md:block", mobileThreadOpen ? "block" : "hidden")}>
            {selectedConversation ? (
              <ConversationThread
                key={selectedConversation.id}
                conversation={selectedConversation}
                detailsOpen={detailsOpen}
                headingRef={threadHeadingRef}
                pendingAction={threadPendingAction}
                onBack={returnToList}
                onClearSelection={clearSelection}
                onPendingAction={(action) => {
                  setThreadPendingAction(action);
                  setNewConversationPending(false);
                }}
                onToggleDetails={() => setDetailsOpen((current) => !current)}
              />
            ) : (
              <ConversationSelectionEmpty />
            )}
          </div>
        </div>
      </Card>
    </section>
  );
}

function MessagesConceptBanner() {
  const { t } = useTranslations();

  return (
    <PrototypeBanner
      description={t("messages.banner.description")}
      title={t("messages.banner.title")}
      trailingAction={
        <Link
          aria-label={t("messages.banner.exitAria")}
          className="grid size-9 shrink-0 place-items-center rounded-full text-primary transition-colors hover:bg-white/70"
          href="/messages"
          title={t("messages.banner.exitTitle")}
        >
          <X aria-hidden="true" className="size-[18px]" />
        </Link>
      }
    />
  );
}

function ConversationSelectionEmpty() {
  const { t } = useTranslations();

  return (
    <section
      aria-labelledby="messages-selection-empty-title"
      className="grid h-full min-h-0 place-items-center bg-[#FBFAF7] px-6 py-10 text-center"
    >
      <div className="max-w-sm">
        <span className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[#78947D1f] text-primary">
          <MessageSquareText aria-hidden="true" className="size-7" />
        </span>
        <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.025em] text-text-primary" id="messages-selection-empty-title">
          {t("messages.selectionEmptyTitle")}
        </h2>
        <p className="mt-3 text-sm leading-6 text-text-muted">
          {t("messages.selectionEmptyDescription")}
        </p>
      </div>
    </section>
  );
}

function MessagesConceptStateView({ state }: { state: Exclude<MessagesConceptState, "ready"> }) {
  const { t } = useTranslations();
  const content = state === "loading"
    ? {
        description: t("messages.conceptStates.loadingDescription"),
        eyebrow: t("messages.conceptStates.loadingEyebrow"),
        icon: LoaderCircle,
        title: t("messages.conceptStates.loadingTitle"),
      }
    : state === "error"
      ? {
          description: t("messages.conceptStates.errorDescription"),
          eyebrow: t("messages.conceptStates.errorEyebrow"),
          icon: AlertTriangle,
          title: t("messages.conceptStates.errorTitle"),
        }
      : {
          description: t("messages.conceptStates.emptyDescription"),
          eyebrow: t("messages.conceptStates.emptyEyebrow"),
          icon: MessageCircle,
          title: t("messages.conceptStates.emptyTitle"),
        };
  const Icon = content.icon;

  return (
    <section
      aria-busy={state === "loading"}
      aria-labelledby="messages-title"
      className="flex h-[calc(100dvh-var(--topbar-height)-6.25rem-env(safe-area-inset-bottom))] min-h-0 min-w-0 flex-col gap-3 md:h-[calc(100dvh-var(--topbar-height)-2.5rem)]"
    >
      <MessagesConceptBanner />
      <Card className="min-h-0 flex-1 overflow-y-auto bg-white p-5 sm:p-8">
        <p className="eyebrow">{t("messages.conversationsEyebrow")}</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-text-primary sm:text-4xl" id="messages-title">
          {t("messages.title")}
        </h1>
        <div className="grid min-h-[70%] place-items-center px-2 py-8 text-center">
          <div className="max-w-md">
            <span className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[#78947D1f] text-primary">
              <Icon aria-hidden="true" className={cn("size-7", state === "loading" && "animate-spin")} />
            </span>
            <p className="eyebrow mt-5">{content.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.025em] text-text-primary">
              {content.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-muted">{content.description}</p>
            {state === "loading" ? (
              <div aria-hidden="true" className="mx-auto mt-6 grid max-w-sm gap-3">
                {[0, 1, 2].map((item) => (
                  <div className="flex items-center gap-3 rounded-[18px] border border-border p-3" key={item}>
                    <span className="skeleton-shimmer size-11 shrink-0 rounded-full" />
                    <span className="min-w-0 flex-1">
                      <span className="skeleton-shimmer block h-3 w-2/3 rounded-full" />
                      <span className="skeleton-shimmer mt-2 block h-3 w-full rounded-full" />
                    </span>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </Card>
    </section>
  );
}
