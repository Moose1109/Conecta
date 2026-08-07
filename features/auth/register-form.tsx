"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineFieldError } from "@/components/ui/inline-field-error";
import { useTranslations } from "@/components/i18n/i18n-provider";
import { registerUser, type RegisterPayload } from "@/lib/api/auth.service";
import { ApiError } from "@/lib/api/client";
import { buildAuthHref } from "@/features/auth/next-path";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { saveSession } from "@/lib/api/session";

type RegisterField = "confirmPassword" | "email" | "name" | "password" | "username";
type RegisterFieldErrors = Partial<Record<RegisterField, string>>;

export function RegisterForm({ nextPath = "/community" }: { nextPath?: string }) {
  const router = useRouter();
  const { t } = useTranslations();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const username = String(formData.get("username") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    const nextFieldErrors: RegisterFieldErrors = {};

    if (name.length < 2) nextFieldErrors.name = t("auth.register.errorNameLength");
    if (username.length < 3) nextFieldErrors.username = t("auth.register.errorUsernameLength");
    if (!email) nextFieldErrors.email = t("auth.register.errorEmailRequired");
    if (password.length < 8) nextFieldErrors.password = t("auth.register.errorPasswordLength");
    if (password.length > 128)
      nextFieldErrors.password = t("auth.register.errorPasswordMaxLength");
    if (password !== confirmPassword)
      nextFieldErrors.confirmPassword = t("auth.register.errorConfirmPasswordMismatch");

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length) {
      setError(t("errors.status422"));
      return;
    }

    const payload: RegisterPayload = {
      name,
      username,
      email,
      password,
    };

    try {
      setIsSubmitting(true);
      const response = await registerUser(payload);

      const token = response.access_token ?? response.token;

      saveSession({ token, user: response.user });

      if (token) {
        router.refresh();
        router.push(nextPath);
        return;
      }

      setSuccess(t("auth.register.successNoToken"));
      window.setTimeout(() => router.push(buildAuthHref("/login", nextPath)), 900);
    } catch (error) {
      if (error instanceof ApiError) {
        const detail = error.detail;
        if (detail === "Email already registered") {
          setFieldErrors({ email: t("errors.backend.emailTaken") });
        } else if (detail === "Username already taken") {
          setFieldErrors({ username: t("errors.backend.usernameTaken") });
        } else if (error.status === 422 && error.fieldErrors) {
          const invalidFields = Object.entries(error.fieldErrors).reduce<RegisterFieldErrors>(
            (fields, [path]) => {
              const field = path.split(".").at(-1);
              if (["email", "name", "password", "username"].includes(String(field))) {
                fields[field as RegisterField] = t("auth.register.errorGenericField");
              }
              return fields;
            },
            {},
          );
          setFieldErrors(invalidFields);
        }
      }
      setError(getApiErrorMessage(error, t, t("auth.register.fallbackError")));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form aria-busy={isSubmitting} className="mt-4 grid gap-3 sm:mt-6 sm:gap-4" onSubmit={handleSubmit}>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <label className="label" htmlFor="register-name">
            {t("auth.register.nameLabel")}
          </label>
          <div className="relative">
            <UserRound
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5E6F63]"
            />
            <input
              className="field field-with-icon"
              id="register-name"
              maxLength={120}
              minLength={2}
              name="name"
              placeholder={t("auth.register.namePlaceholder")}
              autoComplete="name"
              aria-describedby={fieldErrors.name ? "register-name-error" : undefined}
              aria-invalid={Boolean(fieldErrors.name) || undefined}
              required
            />
          </div>
          <InlineFieldError id="register-name-error" message={fieldErrors.name} />
        </div>
        <div>
          <label className="label" htmlFor="register-username">
            {t("auth.register.usernameLabel")}
          </label>
          <div className="relative">
            <UserRound
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5E6F63]"
            />
            <input
              className="field field-with-icon"
              id="register-username"
              maxLength={80}
              minLength={3}
              name="username"
              placeholder={t("auth.register.usernamePlaceholder")}
              autoComplete="username"
              aria-describedby={fieldErrors.username ? "register-username-error" : undefined}
              aria-invalid={Boolean(fieldErrors.username) || undefined}
              required
            />
          </div>
          <InlineFieldError id="register-username-error" message={fieldErrors.username} />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="register-email">
          {t("auth.login.emailLabel")}
        </label>
        <div className="relative">
          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5E6F63]"
          />
          <input
            className="field field-with-icon"
            id="register-email"
            name="email"
            placeholder={t("auth.login.emailPlaceholder")}
            type="email"
            autoComplete="email"
            aria-describedby={fieldErrors.email ? "register-email-error" : undefined}
            aria-invalid={Boolean(fieldErrors.email) || undefined}
            required
          />
        </div>
        <InlineFieldError id="register-email-error" message={fieldErrors.email} />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
        <label className="label" htmlFor="register-password">
          {t("auth.login.passwordLabel")}
        </label>
        <div className="relative">
          <LockKeyhole
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5E6F63]"
          />
          <input
            className="field field-with-action field-with-icon"
            id="register-password"
            maxLength={128}
            minLength={8}
            name="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-describedby={fieldErrors.password ? "register-password-error" : undefined}
            aria-invalid={Boolean(fieldErrors.password) || undefined}
            required
          />
          <button
            aria-label={showPassword ? t("auth.login.hidePassword") : t("auth.login.showPassword")}
            aria-pressed={showPassword}
            className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-[#5E6F63] transition-colors hover:bg-[#1F3D2B0d] hover:text-[#173F2A] focus:outline-none focus:ring-4 focus:ring-[#184B34] focus:ring-offset-2 focus:ring-offset-[#F7F2E8]"
            type="button"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
          </button>
        </div>
        <InlineFieldError id="register-password-error" message={fieldErrors.password} />
        </div>
        <div>
          <label className="label" htmlFor="register-confirm-password">
            {t("auth.register.confirmPasswordLabel")}
          </label>
          <div className="relative">
            <LockKeyhole
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5E6F63]"
            />
            <input
              className="field field-with-icon"
              id="register-confirm-password"
              maxLength={128}
              minLength={8}
              name="confirmPassword"
              placeholder="••••••••"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-describedby={fieldErrors.confirmPassword ? "register-confirm-password-error" : undefined}
              aria-invalid={Boolean(fieldErrors.confirmPassword) || undefined}
              required
            />
          </div>
          <InlineFieldError id="register-confirm-password-error" message={fieldErrors.confirmPassword} />
        </div>
      </div>
      <Button
        type="submit"
        className="auth-primary-button w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        <span>{isSubmitting ? t("auth.register.submitting") : t("auth.register.submit")}</span>
        <ArrowRight aria-hidden="true" className="size-5" />
      </Button>
      {error ? (
        <p className="text-center text-sm font-bold text-red-700" id="register-form-error" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-center text-sm font-bold text-[#3A7D44]" id="register-form-success" role="status">
          {success}
        </p>
      ) : null}
    </form>
  );
}
