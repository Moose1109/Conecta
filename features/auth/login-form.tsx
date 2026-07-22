"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loginUser, type LoginPayload } from "@/lib/api/auth.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { getApiErrorMessage } from "@/lib/api/error-message";
import { saveSession } from "@/lib/api/session";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Completa email y contraseña.");
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
        setError("No se pudo iniciar sesión. Revisa email y contraseña.");
        return;
      }

      saveSession({ token, user: response.user });

      router.refresh();
      router.push("/community");
    } catch (error) {
      setError(
        isUnauthorizedError(error)
          ? "El email o la contraseña no son correctos."
          : getApiErrorMessage(
              error,
              "No se pudo iniciar sesión. Revisa email y contraseña.",
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
          Email
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
            placeholder="tu@email.com"
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
          Contraseña
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
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            aria-pressed={showPassword}
            className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-[#5E6F63] transition-colors hover:bg-[#1F3D2B0d] hover:text-[#173F2A] focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]"
            type="button"
            onClick={() => setShowPassword((value) => !value)}
          >
            {showPassword ? <EyeOff aria-hidden="true" className="size-5" /> : <Eye aria-hidden="true" className="size-5" />}
          </button>
        </div>
      </div>
      <Button
        type="submit"
        className="auth-primary-button w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
      >
        <span>{isSubmitting ? "Entrando..." : "Entrar a comunidad"}</span>
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
