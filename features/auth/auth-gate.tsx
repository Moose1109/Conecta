"use client";

import Link from "next/link";
import { LoaderCircle, LockKeyhole, RefreshCw, ShieldAlert, ShieldX } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { isAdminUser } from "@/features/auth/roles";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { getCurrentUser } from "@/lib/api/auth.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { logApiIssue } from "@/lib/api/error-message";
import { clearSession, saveSession } from "@/lib/api/session";

type SessionVerification = {
  status: "checking" | "allowed" | "denied" | "error";
  adminOnly?: boolean;
  token?: string;
};

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
  const { token } = useAuthSession();
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [sessionVerification, setSessionVerification] = useState<SessionVerification>({
    status: "checking",
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;

    getCurrentUser(token)
      .then((currentUser) => {
        if (!active) {
          return;
        }

        if (!currentUser) {
          setSessionVerification({ status: "error", token, adminOnly });
          return;
        }

        saveSession({ token, user: currentUser });
        setSessionVerification({
          status: adminOnly && !isAdminUser(currentUser) ? "denied" : "allowed",
          token,
          adminOnly,
        });
      })
      .catch((error) => {
        logApiIssue("Unable to verify the current session", error);
        if (!active) {
          return;
        }
        if (isUnauthorizedError(error)) {
          clearSession();
          return;
        }
        setSessionVerification({ status: "error", token, adminOnly });
      });

    return () => {
      active = false;
    };
  }, [adminOnly, token, verificationAttempt]);

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
        <p className="mt-3 text-sm leading-6 text-[#687269]">{resolvedMessage}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0E3325]"
          >
            {t("auth.signIn")}
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#184B3424] bg-white/88 px-5 py-2.5 text-sm font-extrabold text-[#184B34] hover:bg-white"
          >
            {t("auth.createAccount")}
          </Link>
        </div>
      </Card>
    );
  }

  const verificationStatus =
    sessionVerification.token === token &&
    sessionVerification.adminOnly === adminOnly
      ? sessionVerification.status
      : "checking";

  if (verificationStatus === "checking") {
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
        <p className="mt-3 text-sm leading-6 text-[#687269]">
          {adminOnly
            ? t("auth.gate.verifyingPermissionsDescription")
            : t("auth.gate.verifyingAccountDescription")}
        </p>
      </Card>
    );
  }

  if (verificationStatus === "error") {
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
        <p className="mt-3 text-sm leading-6 text-[#687269]">
          {t("auth.gate.serviceUnavailableDescription")}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0E3325]"
            type="button"
            onClick={() => {
              setSessionVerification({ status: "checking", token, adminOnly });
              setVerificationAttempt((attempt) => attempt + 1);
            }}
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

  if (adminOnly && verificationStatus === "denied") {
    return (
      <Card className="mx-auto max-w-xl p-7 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#C96D4A1f] text-[#A95539]"><ShieldX aria-hidden="true" className="size-6" /></span>
        <p className="eyebrow mt-5">
          {t("auth.gate.restrictedAccessEyebrow")}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#18231D]">
          {t("auth.gate.adminPanelUnavailableTitle")}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#687269]">
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
