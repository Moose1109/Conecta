import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { AuthGate } from "@/features/auth/auth-gate";
import { isMessagesConceptState } from "@/features/messages/messages-concept-data";
import { MessagesView } from "@/features/messages/messages-view";
import { getTranslations } from "@/lib/i18n/get-translations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("messages.title") };
}

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ conceptState?: string | string[]; view?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawState = params.conceptState;
  const requestedState = Array.isArray(rawState) ? rawState[0] : rawState;
  const initialState = requestedState && isMessagesConceptState(requestedState)
    ? requestedState
    : "ready";
  const rawView = params.view;
  const requestedView = Array.isArray(rawView) ? rawView[0] : rawView;
  const showConceptView = requestedView === "concept"
    || (requestedState !== undefined && isMessagesConceptState(requestedState));

  const { t } = await getTranslations();

  return (
    <AuthenticatedShell>
      <AuthGate message={t("messages.authGateMessage")}>
        {showConceptView ? (
          <MessagesView initialState={initialState} />
        ) : (
          <MessagesRealState />
        )}
      </AuthGate>
    </AuthenticatedShell>
  );
}

async function MessagesRealState() {
  const { t } = await getTranslations();

  return (
    <>
      <PageHeader
        description={t("messages.realState.description")}
        eyebrow={t("messages.conversationsEyebrow")}
        title={t("messages.title")}
      />
      <BackendPendingAlert
        actionHref="/community"
        actionLabel={t("common.backendPending.actionLabel")}
        className="mb-5"
        description={t("messages.realState.pendingDescription")}
      />

      <Card className="grid min-h-[360px] place-items-center p-6 text-center sm:min-h-[440px] sm:p-10" aria-labelledby="messages-empty-title">
        <div className="max-w-md">
          <span className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[#C96D4A1a] text-[#C96D4A]"><MessageCircle aria-hidden="true" className="size-7" /></span>
          <p className="eyebrow mt-5">{t("messages.realState.noSimulatedDataEyebrow")}</p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.025em] text-[#18231D]" id="messages-empty-title">{t("messages.realState.emptyTitle")}</h2>
          <p className="mt-3 text-sm leading-6 text-[#677168]">{t("messages.realState.emptyDescription")}</p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link className="inline-flex min-h-11 items-center rounded-full bg-[#184B34] px-5 text-sm font-extrabold text-white hover:bg-[#0E3325]" href="/community">{t("common.backendPending.actionLabel")}</Link>
            <Link
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-[#184B3424] bg-white px-5 text-sm font-extrabold text-[#184B34] hover:bg-[#F5F6F1]"
              href="/messages?view=concept"
            >
              <Sparkles aria-hidden="true" className="size-4" />
              {t("messages.realState.viewProposal")}
            </Link>
          </div>
          <p className="mt-3 text-xs font-semibold leading-5 text-[#677168]">
            {t("messages.realState.proposalDisclaimer")}
          </p>
        </div>
      </Card>
    </>
  );
}
