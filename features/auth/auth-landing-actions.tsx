"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { Apple, LogIn, UserPlus } from "lucide-react";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/i18n/i18n-provider";

export type AuthMode = "login" | "register";

type AuthLandingActionsValue = {
  selectMode: (mode: AuthMode) => void;
};

const AuthLandingActionsContext = createContext<AuthLandingActionsValue | null>(null);

export function AuthLandingActionsProvider({
  children,
  selectMode,
}: {
  children: ReactNode;
  selectMode: (mode: AuthMode) => void;
}) {
  return (
    <AuthLandingActionsContext value={{ selectMode }}>
      {children}
    </AuthLandingActionsContext>
  );
}

export function LandingAuthActions() {
  const actions = useContext(AuthLandingActionsContext);
  const { t } = useTranslations();

  if (!actions) {
    return null;
  }

  return (
    <div className="mt-5 grid gap-2 sm:grid-cols-2">
      <Button className="w-full px-4" type="button" onClick={() => actions.selectMode("register")}>
        <UserPlus aria-hidden="true" className="size-4" />
        {t("auth.createAccount")}
      </Button>
      <Button className="w-full px-4" type="button" variant="secondary" onClick={() => actions.selectMode("login")}>
        <LogIn aria-hidden="true" className="size-4" />
        {t("auth.landing.signInLabel")}
      </Button>
    </div>
  );
}

export function AuthProviderButtons({ mode }: { mode: AuthMode }) {
  const { t } = useTranslations();
  const [pendingProvider, setPendingProvider] = useState<"Apple" | "Google">();
  const pendingDescription = pendingProvider
    ? t("auth.providers.pendingDescription", { provider: pendingProvider })
    : "";

  return (
    <div className="mt-4 sm:mt-5">
      <div className="flex items-center gap-3 text-xs font-semibold text-[#7A837C]">
        <span aria-hidden="true" className="h-px flex-1 bg-[#184B3414]" />
        <span>
          {mode === "login"
            ? t("auth.providers.continueWithLogin")
            : t("auth.providers.continueWithRegister")}
        </span>
        <span aria-hidden="true" className="h-px flex-1 bg-[#184B3414]" />
      </div>
      <div className="mt-3 grid gap-2 min-[390px]:grid-cols-2">
        <Button
          aria-describedby={pendingProvider === "Google" ? "auth-provider-pending" : undefined}
          className="w-full px-3"
          type="button"
          variant="secondary"
          onClick={() => setPendingProvider("Google")}
        >
          <span aria-hidden="true" className="grid size-5 place-items-center rounded-full bg-white text-sm font-black text-[#4285F4] shadow-sm">G</span>
          {t("auth.providers.continueWithGoogle")}
        </Button>
        <Button
          aria-describedby={pendingProvider === "Apple" ? "auth-provider-pending" : undefined}
          className="w-full px-3"
          type="button"
          variant="secondary"
          onClick={() => setPendingProvider("Apple")}
        >
          <Apple aria-hidden="true" className="size-5 text-[#18231D]" />
          {t("auth.providers.continueWithApple")}
        </Button>
      </div>
      {pendingProvider ? (
        <div id="auth-provider-pending">
          <BackendPendingAlert
            compact
            className="mt-3"
            description={pendingDescription}
            title={t("auth.providers.pendingTitle", { provider: pendingProvider })}
          />
        </div>
      ) : null}
    </div>
  );
}
