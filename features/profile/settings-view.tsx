"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Camera,
  CheckCircle2,
  ImageIcon,
  LoaderCircle,
  Save,
  UserRound,
} from "lucide-react";
import { UserAvatar } from "@/components/social/user-avatar";
import { Button } from "@/components/ui/button";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { AuthGate } from "@/features/auth/auth-gate";
import { useAuthSession } from "@/features/auth/use-auth-session";
import {
  getCurrentUser,
  updateCurrentUser,
  type UpdateCurrentUserPayload,
} from "@/lib/api/auth.service";
import { getApiErrorMessage, logApiIssue } from "@/lib/api/error-message";
import { isUnauthorizedError } from "@/lib/api/client";
import { clearSession, getStoredUser, saveSession } from "@/lib/api/session";
import type { AuthUser } from "@/lib/types";

type ProfileForm = {
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  email: string;
  name: string;
  username: string;
};

function formFromUser(user?: AuthUser): ProfileForm {
  return {
    avatarUrl: user?.avatarUrl ?? "",
    bannerUrl: user?.bannerUrl ?? "",
    bio: user?.bio ?? "",
    email: user?.email ?? "",
    name: user?.name ?? "",
    username: user?.username ?? "",
  };
}

export function SettingsView() {
  const router = useRouter();
  const { token, user: sessionUser } = useAuthSession();
  const [form, setForm] = useState<ProfileForm>(() => formFromUser(sessionUser));
  const [loadedToken, setLoadedToken] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) return;

    let active = true;

    getCurrentUser(token)
      .then((currentUser) => {
        if (!active) return;
        const resolvedUser = currentUser ?? getStoredUser();
        setForm(formFromUser(resolvedUser));
        if (currentUser) saveSession({ token, user: currentUser });
      })
      .catch((loadError) => {
        if (!active) return;
        if (isUnauthorizedError(loadError)) {
          clearSession();
          return;
        }
        logApiIssue("Error loading profile settings", loadError);
        setError(
          getApiErrorMessage(
            loadError,
            "No hemos podido actualizar los datos del formulario. Puedes reintentarlo.",
          ),
        );
      })
      .finally(() => {
        if (active) {
          setLoadedToken(token);
        }
      });

    return () => {
      active = false;
    };
  }, [token]);

  const isLoading = Boolean(token && loadedToken !== token);

  function updateField<Key extends keyof ProfileForm>(key: Key, value: ProfileForm[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
    setError("");
    setSuccess("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!token) {
      setError("Tu sesión ha caducado. Vuelve a iniciar sesión.");
      return;
    }

    const name = form.name.trim();
    const username = form.username.trim();
    const bio = form.bio.trim();

    if (name.length < 2 || username.length < 3) {
      setError("El nombre debe tener al menos 2 caracteres y el usuario al menos 3.");
      return;
    }

    if (bio.length > 500) {
      setError("La bio no puede superar los 500 caracteres.");
      return;
    }

    const payload: UpdateCurrentUserPayload = {
      name,
      username,
      avatar_url: form.avatarUrl.trim() || null,
      banner_url: form.bannerUrl.trim() || null,
      bio: bio || null,
    };

    try {
      setIsSubmitting(true);
      const updatedUser = await updateCurrentUser(payload, token);

      if (!updatedUser) {
        setError("El servicio no devolvió un perfil válido. Inténtalo de nuevo.");
        return;
      }

      saveSession({ token, user: updatedUser });
      setForm(formFromUser(updatedUser));
      setSuccess("Perfil actualizado correctamente.");
      router.refresh();
    } catch (submitError) {
      logApiIssue("Error updating current user", submitError);
      if (isUnauthorizedError(submitError)) {
        clearSession();
        return;
      }
      setError(
        getApiErrorMessage(
          submitError,
          "No se pudo guardar el perfil. Revisa los campos e inténtalo de nuevo.",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasError = Boolean(error);

  return (
    <AuthGate message="Para editar tu perfil necesitas iniciar sesión.">
      <PageHeader
        eyebrow="Tu cuenta"
        title="Editar perfil"
        description="Actualiza la identidad que verá el resto de la comunidad."
      />

      <Card className="overflow-hidden">
        <div
          className="relative h-40 bg-[linear-gradient(120deg,#0E3325,#347A48_58%,#D7A63C)] bg-cover bg-center sm:h-52"
          style={form.bannerUrl ? { backgroundImage: `linear-gradient(180deg, rgba(14,51,37,.08), rgba(14,51,37,.58)), url(${JSON.stringify(form.bannerUrl)})` } : undefined}
        >
          <label
            className="absolute right-4 top-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-black/55 px-4 text-xs font-extrabold text-white backdrop-blur transition hover:bg-black/70"
            htmlFor="settings-banner"
          >
            <Camera aria-hidden="true" className="size-4" />
            Cambiar portada
          </label>
        </div>

        <form className="p-5 sm:p-7" onSubmit={handleSubmit}>
          <div className="-mt-16 mb-7 flex flex-col items-start gap-4 sm:flex-row sm:items-end">
            <UserAvatar
              className="size-24 border-4 border-[#FFFCF7] text-2xl ring-0 sm:size-28"
              imageUrl={form.avatarUrl || sessionUser?.avatarUrl}
              name={form.name || "Usuario"}
            />
            <label
              className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-[#184B3418] bg-white px-4 text-xs font-extrabold text-[#184B34] shadow-sm hover:bg-[#F7F2E8]"
              htmlFor="settings-avatar"
            >
              <UserRound aria-hidden="true" className="size-4" />
              Cambiar avatar
            </label>
          </div>

          {isLoading ? (
            <p className="mb-5 flex items-center gap-2 rounded-2xl bg-[#184B340a] p-4 text-sm font-bold text-[#184B34]" role="status">
              <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
              Cargando los datos actuales de tu perfil…
            </p>
          ) : null}

          <div className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="settings-name">Nombre</label>
                <input
                  aria-invalid={hasError || undefined}
                  className="field"
                  id="settings-name"
                  maxLength={120}
                  minLength={2}
                  required
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />
              </div>
              <div>
                <label className="label" htmlFor="settings-username">Usuario</label>
                <input
                  aria-invalid={hasError || undefined}
                  autoComplete="username"
                  className="field"
                  id="settings-username"
                  maxLength={80}
                  minLength={3}
                  required
                  value={form.username}
                  onChange={(event) => updateField("username", event.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="label" htmlFor="settings-email">Email</label>
              <input
                className="field bg-[#F1EFE8] text-[#687269]"
                id="settings-email"
                readOnly
                type="email"
                value={form.email}
              />
              <p className="mt-1.5 text-xs text-[#687269]">El contrato actual no permite cambiar el email.</p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="settings-avatar">URL del avatar</label>
                <div className="relative">
                  <UserRound aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#60818A]" />
                  <input
                    className="field field-with-icon"
                    id="settings-avatar"
                    inputMode="url"
                    placeholder="https://…"
                    type="url"
                    value={form.avatarUrl}
                    onChange={(event) => updateField("avatarUrl", event.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="settings-banner">URL de la portada</label>
                <div className="relative">
                  <ImageIcon aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-[#60818A]" />
                  <input
                    className="field field-with-icon"
                    id="settings-banner"
                    inputMode="url"
                    placeholder="https://…"
                    type="url"
                    value={form.bannerUrl}
                    onChange={(event) => updateField("bannerUrl", event.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="label" htmlFor="settings-bio">Bio</label>
              <textarea
                aria-describedby="settings-bio-count"
                className="field min-h-32 resize-y"
                id="settings-bio"
                maxLength={500}
                placeholder="Cuenta algo sobre tu relación con los pueblos y la comunidad."
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
              />
              <p className="mt-1.5 text-right text-xs text-[#687269]" id="settings-bio-count">{form.bio.length}/500</p>
            </div>

            <BackendPendingAlert
              compact
              description="El contrato anuncia un pueblo favorito, pero el backend actual descarta ese valor y no lo persiste. La edición permanecerá deshabilitada hasta que exista almacenamiento real."
              title="Pueblo favorito pendiente de backend"
            />
          </div>

          {error ? <p className="mt-5 rounded-2xl border border-[#C96D4A33] bg-[#C96D4A12] p-4 text-sm font-bold text-[#873E29]" role="alert">{error}</p> : null}
          {success ? <p className="mt-5 flex items-center gap-2 rounded-2xl border border-[#347A4830] bg-[#347A4810] p-4 text-sm font-bold text-[#184B34]" role="status"><CheckCircle2 aria-hidden="true" className="size-5" />{success}</p> : null}

          <div className="mt-6 flex justify-end">
            <Button disabled={isLoading || isSubmitting} type="submit">
              {isSubmitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Save aria-hidden="true" className="size-4" />}
              {isSubmitting ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Card>
    </AuthGate>
  );
}
