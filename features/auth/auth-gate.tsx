"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LoaderCircle, LockKeyhole, RefreshCw, ShieldAlert, ShieldX } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { buildAuthHref } from "@/features/auth/next-path";
import { isAdminUser } from "@/features/auth/roles";
import { retrySessionVerification } from "@/features/auth/session-verification";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { clearSession } from "@/lib/api/session";

export function AuthGate({
  adminOnly = false,
  children,
  message,
}: {
  adminOnly?: boolean;
  children: ReactNode;
  message?: string;
}) {
  const { t } = useTranslations();
  const resolvedMessage = message ?? t("auth.gate.defaultMessage");
  const { token, user, status } = useAuthSession();
  const pathname = usePathname();
  const returnTo = `${pathname}${
    typeof window !== "undefined" ? `${window.location.search}${window.location.hash}` : ""
  }`;

  if (!token) {
    return (
      <Card className="mx-auto max-w-xl p-7 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#D7A63C24] text-[#184B34]"><LockKeyhole aria-hidden="true" className="size-6" /></span>
        <p className="eyebrow mt-5">
          {t("auth.gate.privateAccessEyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#18231D]">
          {t("auth.gate.needsLoginTitle")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#677168]">{resolvedMessage}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href={buildAuthHref("/login", returnTo)}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0E3325]"
          >
            {t("auth.signIn")}
          </Link>
          <Link
            href={buildAuthHref("/register", returnTo)}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#184B3424] bg-white/88 px-5 py-2.5 text-sm font-extrabold text-[#184B34] hover:bg-white"
          >
            {t("auth.createAccount")}
          </Link>
        </div>
      </Card>
    );
  }

  if (status === "pending") {
    return (
      <Card
        aria-live="polite"
        className="mx-auto max-w-xl p-7 text-center"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#D7A63C24] text-[#184B34]">
          <LoaderCircle aria-hidden="true" className="size-6 animate-spin" />
        </span>
        <p className="eyebrow mt-5">{t("auth.gate.checkingSessionEyebrow")}</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#18231D]">
          {adminOnly ? t("auth.gate.verifyingPermissionsTitle") : t("auth.gate.verifyingAccountTitle")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#677168]">
          {adminOnly
            ? t("auth.gate.verifyingPermissionsDescription")
            : t("auth.gate.verifyingAccountDescription")}
        </p>
      </Card>
    );
  }

  if (status === "error") {
    return (
      <Card
        aria-live="polite"
        className="mx-auto max-w-xl p-7 text-center"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#C96D4A1f] text-[#A95539]">
          <ShieldAlert aria-hidden="true" className="size-6" />
        </span>
        <p className="eyebrow mt-5">{t("auth.gate.interruptedEyebrow")}</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#18231D]">
          {adminOnly
            ? t("auth.gate.permissionsErrorTitle")
            : t("auth.gate.sessionErrorTitle")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#677168]">
          {t("auth.gate.serviceUnavailableDescription")}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0E3325]"
            type="button"
            onClick={() => retrySessionVerification(token)}
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            {t("common.retry")}
          </button>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#184B3424] bg-white/88 px-5 py-2.5 text-sm font-extrabold text-[#184B34] hover:bg-white"
            onClick={clearSession}
          >
            {t("auth.gate.backToLogin")}
          </Link>
        </div>
      </Card>
    );
  }

  if (adminOnly && !isAdminUser(user)) {
    return (
      <Card className="mx-auto max-w-xl p-7 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#C96D4A1f] text-[#A95539]"><ShieldX aria-hidden="true" className="size-6" /></span>
        <p className="eyebrow mt-5">
          {t("auth.gate.restrictedAccessEyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#18231D]">
          {t("auth.gate.adminPanelUnavailableTitle")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#677168]">
          {t("auth.gate.adminPanelUnavailableDescription")}
        </p>
        <div className="mt-6">
          <Link
            href="/community"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0E3325]"
          >
            {t("common.backendPending.actionLabel")}
          </Link>
        </div>
      </Card>
    );
  }

  return children;
}
