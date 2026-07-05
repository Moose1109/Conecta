"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { isUnauthorizedError } from "@/lib/api/client";
import {
  createActivity,
  type CreateActivityPayload,
} from "@/lib/api/activities.service";
import { clearSession, getStoredToken } from "@/lib/api/session";
import type { ActivityCategory, Village } from "@/lib/types";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CreateActivityForm({
  categories,
  villages,
}: {
  categories: ActivityCategory[];
  villages: Village[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const token = getStoredToken();

    if (!token) {
      setError("Inicia sesión para crear una actividad.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const title = String(formData.get("title") ?? "").trim();
    const villageId = String(formData.get("villageId") ?? "").trim();
    const category = String(formData.get("category") ?? "").trim();
    const date = String(formData.get("date") ?? "").trim();
    const time = String(formData.get("time") ?? "").trim();
    const capacity = Number(formData.get("capacity"));
    const location = String(formData.get("location") ?? "").trim();
    const description = String(formData.get("description") ?? "").trim();

    if (
      !title ||
      !villageId ||
      !category ||
      !date ||
      !time ||
      !capacity ||
      !location ||
      !description
    ) {
      setError("Completa título, pueblo, categoría, fecha, hora, plazas, lugar y descripción.");
      return;
    }

    const slugSuffix =
      typeof crypto.randomUUID === "function"
        ? crypto.randomUUID().slice(0, 8)
        : `${title.length}-${capacity}`;

    const payload: CreateActivityPayload = {
      slug: `${slugify(title)}-${slugSuffix}`,
      title,
      description,
      village_id: villageId,
      category,
      starts_at: `${date}T${time}:00`,
      capacity,
      location,
      status: "published",
    };

    try {
      setIsSubmitting(true);
      const response = await createActivity(payload, token);
      const id = typeof response.id === "string" ? response.id : payload.slug;

      setSuccess("Actividad creada correctamente.");
      router.push(`/activities/${id}`);
    } catch (error) {
      console.error("Error creating activity:", error);
      if (isUnauthorizedError(error)) {
        clearSession();
        setError("Debes iniciar sesión para crear una actividad.");
      } else {
        setError("No se pudo crear la actividad. Revisa los datos o vuelve a iniciar sesión.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div>
        <label className="label" htmlFor="title">
          Título
        </label>
        <input
          className="field"
          id="title"
          name="title"
          placeholder="Paseo botánico al atardecer"
        />
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="label" htmlFor="village">
            Pueblo
          </label>
          <select className="field" id="village" name="villageId" defaultValue="">
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
          <label className="label" htmlFor="category">
            Categoría
          </label>
          <select className="field" id="category" name="category" defaultValue="">
            <option value="" disabled>
              Selecciona una categoría
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="label" htmlFor="date">
            Fecha
          </label>
          <input className="field" id="date" name="date" type="date" />
        </div>
        <div>
          <label className="label" htmlFor="time">
            Hora
          </label>
          <input className="field" id="time" name="time" type="time" />
        </div>
        <div>
          <label className="label" htmlFor="capacity">
            Plazas
          </label>
          <input
            className="field"
            id="capacity"
            min="1"
            name="capacity"
            placeholder="24"
            type="number"
          />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="location">
          Lugar
        </label>
        <input className="field" id="location" name="location" placeholder="Plaza mayor" />
      </div>
      <div>
        <label className="label" htmlFor="description">
          Descripción
        </label>
        <textarea
          className="field min-h-36 resize-y"
          id="description"
          name="description"
          placeholder="Cuenta qué se hará, para quién es y qué debe traer la gente."
        />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creando..." : "Crear actividad"}
        </Button>
        {error ? (
          <p className="text-sm font-bold text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="text-sm font-bold text-[#3A7D44]" role="status">
            {success}
          </p>
        ) : null}
      </div>
    </form>
  );
}
