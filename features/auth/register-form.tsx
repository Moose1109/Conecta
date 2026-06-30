"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { registerUser, type RegisterPayload } from "@/lib/api/auth.service";
import type { Village } from "@/lib/types";

export function RegisterForm({ villages }: { villages: Village[] }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const favoriteVillageId = String(formData.get("favoriteVillageId") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!name || !email || !favoriteVillageId || !password) {
      setError("Completa nombre, email, pueblo favorito y contraseña.");
      return;
    }

    const payload: RegisterPayload = {
      name,
      username: usernameFromEmail(email),
      email,
      password,
      favorite_village_id: favoriteVillageId,
    };

    try {
      setIsSubmitting(true);
      console.log("REGISTER PAYLOAD:", payload);
      const response = await registerUser(payload);
      console.log("REGISTER RESPONSE:", response);

      const token = response.access_token ?? response.token;

      if (token) {
        window.localStorage.setItem("conecta-pueblos-token", token);
      }

      if (response.user) {
        window.localStorage.setItem("conecta-pueblos-user", JSON.stringify(response.user));
      }

      if (token) {
        router.push("/dashboard");
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
          <input className="field" id="name" name="name" placeholder="Ana" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input className="field" id="email" name="email" placeholder="ana@pueblo.es" type="email" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="favorite">
          Pueblo favorito
        </label>
        <select className="field" id="favorite" name="favoriteVillageId" defaultValue="">
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
        {isSubmitting ? "Creando cuenta..." : "Crear cuenta demo"}
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
