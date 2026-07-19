"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { AuthIcon } from "@/features/auth/auth-icons";
import { registerUser, type RegisterPayload } from "@/lib/api/auth.service";
import { saveSession } from "@/lib/api/session";
import type { Village } from "@/lib/types";

export function RegisterForm({ villages }: { villages: Village[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function usernameFromEmail(value: string) {
    return value.split("@")[0]?.toLowerCase().replace(/[^a-z0-9._-]+/g, ".") || "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!name || !email || !password) {
      setError("Completa nombre, email y contraseña.");
      return;
    }

    const payload: RegisterPayload = {
      name,
      username: usernameFromEmail(email),
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
        router.push("/community");
        return;
      }

      setSuccess("Cuenta creada. Te llevamos al login para entrar.");
      window.setTimeout(() => router.push("/login"), 900);
    } catch (error) {
      console.error("Error registering user:", error);
      const message = error instanceof Error ? error.message : "No se pudo crear la cuenta.";
      setError(
        message.includes("404")
          ? "Registro todavía no disponible en backend."
          : message,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-6 grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">
            Nombre
          </label>
          <div className="relative">
            <AuthIcon
              className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5E6F63]"
              name="user"
            />
            <input className="field field-with-icon" id="name" name="name" placeholder="Tu nombre" />
          </div>
        </div>
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
      </div>
      <div>
        <label className="label" htmlFor="favorite">
          Pueblo favorito
          <span className="ml-1 text-xs text-[#1E1E1E]/44">(opcional)</span>
        </label>
        <div className="relative">
          <AuthIcon
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-[#5E6F63]"
            name="map-pin"
          />
          <select className="field field-with-icon" id="favorite" name="favoriteVillageId" defaultValue="">
          <option value="" disabled>
            Selecciona un pueblo
          </option>
          {villages.map((village) => (
            <option key={village.id} value={village.id}>
              {village.name}
            </option>
          ))}
          </select>
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
        <span>{isSubmitting ? "Creando cuenta..." : "Crear mi cuenta"}</span>
        <AuthIcon className="size-5" name="arrow-right" />
      </Button>
      {error ? (
        <p className="text-center text-sm font-bold text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="text-center text-sm font-bold text-[#3A7D44]" role="status">
          {success}
        </p>
      ) : null}
    </form>
  );
}
