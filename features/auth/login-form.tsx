"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Button } from "@/components/ui/button";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { loginUser, type LoginPayload } from "@/lib/api/auth.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { saveSession } from "@/lib/api/session";

export function LoginForm() {
  const router = useRouter();
  const { t } = useTranslations();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRecoveryNotice, setShowRecoveryNotice] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError(t("auth.login.errorEmptyFields"));
      return;
    }

    const payload: LoginPayload = {
      email,
      password,
    };

    try {
      setIsSubmitting(true);
      const response = await loginUser(payload);

      const token = response.token ?? response.access_token;

      if (!token) {
        setError(t("auth.login.genericError"));
        return;
      }

      saveSession({ token, user: response.user });

      router.refresh();
      router.push("/community");
    } catch (error) {
      setError(
        isUnauthorizedError(error)
          ? t("auth.login.errorInvalidCredentials")
          : getApiErrorMessage(
              error,
              t,
              t("auth.login.genericError"),
            ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form aria-busy={isSubmitting} className="mt-4 grid gap-3 sm:mt-6 sm:gap-4" onSubmit={handleSubmit}>
      <div>
        <label className="label" htmlFor="login-email">
          {t("auth.login.emailLabel")}
        </label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5E6F63]"
          />
          <input
            className="field field-with-icon"
            id="login-email"
            name="email"
            placeholder={t("auth.login.emailPlaceholder")}
            type="email"
            autoComplete="email"
            aria-describedby={error ? "login-form-error" : undefined}
            aria-invalid={error ? true : undefined}
            required
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="login-password">
          {t("auth.login.passwordLabel")}
        </label>
        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5E6F63]"
          />
          <input
            className="field field-with-action field-with-icon"
            id="login-password"
            maxLength={128}
            name="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-describedby={error ? "login-form-error" : undefined}
            aria-invalid={error ? true : undefined}
            required
          />
          <button
            aria-label={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
            aria-pressed={showPassword}
            className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-[#5E6F63] transition-colors hover:bg-[#1F3D2B0d] hover:text-[#173F2A] focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]"
            type="button"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
          </button>
        </div>
        <div className="mt-1 flex justify-end">
          <button
            aria-describedby={showRecoveryNotice ? "password-recovery-pending" : undefined}
            className="inline-flex min-h-11 items-center rounded-full px-2 text-xs font-extrabold text-[#347A48] transition-colors hover:bg-[#347A480d] hover:text-[#184B34]"
            type="button"
            onClick={() => setShowRecoveryNotice(true)}
          >
            {t("auth.login.forgotPassword")}
          </button>
        </div>
      </div>
      {showRecoveryNotice ? (
        <div id="password-recovery-pending">
          <BackendPendingAlert
            compact
            description={t("auth.login.recoveryPendingDescription")}
            title={t("auth.login.recoveryPendingTitle")}
          />
        </div>
      ) : null}
      <Button
        type="submit"
        className="auth-primary-button w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        <span>{isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}</span>
        <ArrowRight aria-hidden="true" className="size-5" />
      </Button>
      {error ? (
        <p className="text-center text-sm font-bold text-red-700" id="login-form-error" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
