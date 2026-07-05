"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { loginUser, type LoginPayload } from "@/lib/api/auth.service";
import { saveSession } from "@/lib/api/session";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      router.push("/dashboard");
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
        <input className="field" id="email" name="email" placeholder="tu@email.com" type="email" />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Contraseña
        </label>
        <input className="field" id="password" name="password" placeholder="••••••••" type="password" />
      </div>
      <Button
        type="submit"
        className="w-full disabled:cursor-not-allowed disabled:opacity-70"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Entrando..." : "Entrar a mi espacio"}
      </Button>
      {error ? (
        <p className="text-center text-sm font-bold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
