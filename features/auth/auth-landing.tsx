"use client";

import { useRouter } from "next/navigation";
import { type KeyboardEvent, type ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { LogIn, RefreshCw, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  AuthLandingActionsProvider,
  type AuthMode,
  AuthProviderButtons,
} from "@/features/auth/auth-landing-actions";
import { LoginForm } from "@/features/auth/login-form";
import { PublicAuthShell } from "@/features/auth/public-auth-shell";
import { RegisterForm } from "@/features/auth/register-form";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { getCurrentUser } from "@/lib/api/auth.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { logApiIssue } from "@/lib/api/error-message";
import {
  clearSession,
  hasValidJwtStructure,
  saveSession,
} from "@/lib/api/session";
import { cn } from "@/lib/utils";

export function AuthLanding({
  discovery,
  initialMode = "login",
}: {
  discovery?: ReactNode;
  initialMode?: AuthMode;
}) {
  const router = useRouter();
  const { t } = useTranslations();
  const { token } = useAuthSession();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [failedSessionCheck, setFailedSessionCheck] = useState<string>();
  const [sessionCheckAttempt, setSessionCheckAttempt] = useState(0);
  const loginTabRef = useRef<HTMLButtonElement>(null);
  const registerTabRef = useRef<HTMLButtonElement>(null);

  const selectModeAndFocus = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("auth-access")?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const firstFieldId = nextMode === "login" ? "login-email" : "register-name";
        document.getElementById(firstFieldId)?.focus({ preventScroll: true });
      });
    });
  }, []);

  useEffect(() => {
    if (!token) return;

    if (!hasValidJwtStructure(token)) {
      clearSession();
      return;
    }

    let active = true;

    getCurrentUser(token)
      .then((currentUser) => {
        if (!active) return;

        if (!currentUser) {
          clearSession();
          return;
        }

        saveSession({ token, user: currentUser });
        router.replace("/community");
      })
      .catch((error) => {
        logApiIssue("Unable to validate the stored session", error);
        if (!active) return;

        if (isUnauthorizedError(error)) {
          clearSession();
        } else {
          setFailedSessionCheck(token);
        }
      });

    return () => {
      active = false;
    };
  }, [router, sessionCheckAttempt, token]);

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const nextMode: AuthMode = event.key === "Home"
      ? "login"
      : event.key === "End"
        ? "register"
        : mode === "login"
          ? "register"
          : "login";

    setMode(nextMode);
    (nextMode === "login" ? loginTabRef : registerTabRef).current?.focus();
  }

  if (token && failedSessionCheck !== token) {
    return (
      <main className="grid min-h-dvh place-items-center bg-[#F7F2E8] px-5">
        <Card className="w-full max-w-sm p-7 text-center">
          <p className="eyebrow">ConectaPueblos</p>
          <h1 className="mt-3 text-2xl font-extrabold text-[#18231D]">{t("auth.landing.openingCommunity")}</h1>
          <p className="mt-2 text-sm leading-6 text-[#687269]">{t("auth.landing.alreadySignedIn")}</p>
        </Card>
      </main>
    );
  }

  return (
    <AuthLandingActionsProvider selectMode={selectModeAndFocus}>
      <PublicAuthShell discovery={discovery}>
      <Card className="auth-fade-scale rounded-[24px] border-white/90 bg-white/94 p-4 shadow-[0_24px_80px_rgba(24,75,52,0.12)] sm:rounded-[28px] sm:p-7">
        {token && failedSessionCheck === token ? (
          <div
            className="mb-5 rounded-2xl border border-[#C96D4A33] bg-[#C96D4A12] p-4"
            role="alert"
          >
            <p className="text-sm font-extrabold text-[#873E29]">
              {t("auth.landing.sessionCheckFailedTitle")}
            </p>
            <p className="mt-1 text-xs font-medium leading-5 text-[#873E29]">
              {t("auth.landing.sessionCheckFailedDescription")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#184B34] px-4 text-xs font-extrabold text-white hover:bg-[#0E3325]"
                type="button"
                onClick={() => {
                  setFailedSessionCheck(undefined);
                  setSessionCheckAttempt((attempt) => attempt + 1);
                }}
              >
                <RefreshCw aria-hidden="true" className="size-4" />
                {t("common.retry")}
              </button>
              <button
                className="inline-flex min-h-11 items-center rounded-full border border-[#184B3424] bg-white px-4 text-xs font-extrabold text-[#184B34] hover:bg-[#F7F2E8]"
                type="button"
                onClick={clearSession}
              >
                {t("auth.landing.useAnotherAccount")}
              </button>
            </div>
          </div>
        ) : null}
        <p className="text-sm font-extrabold text-[#184B34]">
          {mode === "login" ? t("auth.landing.enterTo") : t("auth.landing.joinTo")}
        </p>
        <h1 className="mt-1 text-2xl font-extrabold leading-[1.08] tracking-[-0.04em] text-[#0E3325] sm:text-4xl">
          ConectaPueblos
        </h1>
        <p className="mt-3 max-w-md text-sm font-medium leading-6 text-[#687269] sm:mt-4">
          {mode === "login"
            ? t("auth.landing.loginDescription")
            : t("auth.landing.registerDescription")}
        </p>

        <div aria-label={t("auth.landing.tabsLabel")} aria-orientation="horizontal" className="mt-4 grid grid-cols-2 rounded-[15px] border border-[#184B3418] bg-[#F8F7F3] p-1 sm:mt-6" role="tablist">
          <button
            ref={loginTabRef}
            aria-controls="auth-panel-login"
            aria-selected={mode === "login"}
            className={cn(
              "inline-flex min-h-12 items-center justify-center gap-2 rounded-[12px] px-2 text-xs font-extrabold transition-all sm:text-sm",
              mode === "login" ? "bg-white text-[#184B34] shadow-sm ring-1 ring-[#184B3410]" : "text-[#687269] hover:text-[#184B34]",
            )}
            id="auth-tab-login"
            role="tab"
            tabIndex={mode === "login" ? 0 : -1}
            type="button"
            onKeyDown={handleTabKeyDown}
            onClick={() => setMode("login")}
          >
            <LogIn aria-hidden="true" className="size-4" />
            {t("auth.landing.signInLabel")}
          </button>
          <button
            ref={registerTabRef}
            aria-controls="auth-panel-register"
            aria-selected={mode === "register"}
            className={cn(
              "inline-flex min-h-12 items-center justify-center gap-2 rounded-[12px] px-2 text-xs font-extrabold transition-all sm:text-sm",
              mode === "register" ? "bg-white text-[#184B34] shadow-sm ring-1 ring-[#184B3410]" : "text-[#687269] hover:text-[#184B34]",
            )}
            id="auth-tab-register"
            role="tab"
            tabIndex={mode === "register" ? 0 : -1}
            type="button"
            onKeyDown={handleTabKeyDown}
            onClick={() => setMode("register")}
          >
            <UserPlus aria-hidden="true" className="size-4" />
            {t("auth.createAccount")}
          </button>
        </div>

        <div aria-labelledby="auth-tab-login" hidden={mode !== "login"} id="auth-panel-login" role="tabpanel" tabIndex={0}>
          <LoginForm />
        </div>
        <div aria-labelledby="auth-tab-register" hidden={mode !== "register"} id="auth-panel-register" role="tabpanel" tabIndex={0}>
          <RegisterForm />
        </div>

        <AuthProviderButtons mode={mode} />

        <p className="mt-3 text-center text-sm font-medium text-[#687269] sm:mt-5">
          {mode === "login" ? t("auth.landing.noAccountYet") : t("auth.landing.alreadyHaveAccount")}
          <button className="inline-flex min-h-11 items-center font-extrabold text-[#347A48] hover:text-[#184B34]" type="button" onClick={() => selectModeAndFocus(mode === "login" ? "register" : "login")}>
            {mode === "login" ? t("auth.createAccount") : t("auth.landing.signInLabel")}
          </button>
        </p>
      </Card>
      </PublicAuthShell>
    </AuthLandingActionsProvider>
  );
}
