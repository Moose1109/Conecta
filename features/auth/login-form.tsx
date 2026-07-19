"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthIcon } from "@/features/auth/auth-icons";
import { loginUser, type LoginPayload } from "@/lib/api/auth.service";
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
      console.error("Error login:", error);
      const message = error instanceof Error ? error.message : "";
      setError(
        message.includes("404")
          ? "Login todavía no disponible en backend"
          : "No se pudo iniciar sesión. Revisa email y contraseña.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <AuthIcon
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5E6F63]"
            name="mail"
          />
          <input
            className="field field-with-icon"
            id="email"
            name="email"
            placeholder="tu@email.com"
            type="email"
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="password">
          Contraseña
        </label>
        <div className="relative">
          <AuthIcon
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5E6F63]"
            name="lock"
          />
          <input
            className="field field-with-action field-with-icon"
            id="password"
            name="password"
            placeholder="••••••••"
            type={showPassword ? "text" : "password"}
          />
          <button
            aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
            className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[#5E6F63] transition-colors hover:bg-[#1F3D2B0d] hover:text-[#173F2A] focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]"
            type="button"
            onClick={() => setShowPassword((value) => !value)}
          >
            <AuthIcon className="size-5" name={showPassword ? "eye-off" : "eye"} />
          </button>
        </div>
      </div>
      <Button
        type="submit"
        className="auth-primary-button w-full gap-2 disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        <span>{isSubmitting ? "Entrando..." : "Entrar a comunidad"}</span>
        <AuthIcon className="size-5" name="arrow-right" />
      </Button>
      {error ? (
        <p className="text-center text-sm font-bold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
