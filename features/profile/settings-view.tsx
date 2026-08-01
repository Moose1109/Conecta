"use client";

import { type FormEvent, type ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Accessibility,
  AtSign,
  Bell,
  Camera,
  CheckCircle2,
  Eye,
  ImageIcon,
  Keyboard,
  LoaderCircle,
  Mail,
  Move,
  Save,
  ShieldCheck,
  Type,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { UserAvatar } from "@/components/social/user-avatar";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { AuthGate } from "@/features/auth/auth-gate";
import { useAuthSession } from "@/features/auth/use-auth-session";
import {
  getCurrentUser,
  updateCurrentUser,
  type UpdateCurrentUserPayload,
} from "@/lib/api/auth.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { getApiErrorMessage, logApiIssue } from "@/lib/api/error-message";
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

type SettingsSectionId =
  | "profile"
  | "account"
  | "privacy"
  | "notifications"
  | "security"
  | "accessibility";

const settingsNavigation: Array<{
  icon: LucideIcon;
  id: SettingsSectionId;
  label: string;
}> = [
  { icon: UserRound, id: "profile", label: "Perfil" },
  { icon: AtSign, id: "account", label: "Cuenta" },
  { icon: Eye, id: "privacy", label: "Privacidad" },
  { icon: Bell, id: "notifications", label: "Notificaciones" },
  { icon: ShieldCheck, id: "security", label: "Seguridad" },
  { icon: Accessibility, id: "accessibility", label: "Accesibilidad" },
];

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
        if (active) setLoadedToken(token);
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
        title="Ajustes"
        description="Gestiona tu identidad y consulta qué preferencias están disponibles en cada área."
      />

      <div className="grid items-start gap-5 xl:grid-cols-[240px_minmax(0,1fr)]">
        <Card className="min-w-0 max-w-full p-2 xl:sticky xl:top-[92px]">
          <nav aria-label="Secciones de Ajustes" className="flex snap-x gap-1 overflow-x-auto [scrollbar-width:none] xl:grid xl:overflow-visible [&::-webkit-scrollbar]:hidden">
            {settingsNavigation.map(({ icon: Icon, id, label }) => (
              <a
                className="inline-flex min-h-11 shrink-0 snap-start items-center gap-3 rounded-2xl px-3.5 text-sm font-extrabold text-[#526057] transition-colors hover:bg-[#184B340a] hover:text-[#184B34] focus:outline-none focus:ring-4 focus:ring-[#347A4824]"
                href={`#settings-${id}`}
                key={id}
              >
                <Icon aria-hidden="true" className="size-4.5" />
                {label}
              </a>
            ))}
          </nav>
        </Card>

        <div className="grid min-w-0 gap-5">
          <section className="scroll-mt-28" id="settings-profile">
            <Card className="overflow-hidden">
              <SettingsHeading
                description="Estos son los campos que el servicio actual guarda realmente."
                icon={UserRound}
                title="Perfil"
              />
              <div
                className="relative h-40 bg-[linear-gradient(120deg,#0E3325,#347A48_58%,#D7A63C)] bg-cover bg-center sm:h-52"
                style={form.bannerUrl ? { backgroundImage: `linear-gradient(180deg, rgba(14,51,37,.08), rgba(14,51,37,.58)), url(${JSON.stringify(form.bannerUrl)})` } : undefined}
              >
                <label
                  className="absolute right-4 top-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-black/55 px-4 text-xs font-extrabold text-white backdrop-blur transition hover:bg-black/70"
                  htmlFor="settings-banner"
                >
                  <Camera aria-hidden="true" className="size-4" />
                  Editar URL de portada
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
                    Editar URL del avatar
                  </label>
                </div>

                {isLoading ? (
                  <p className="mb-5 flex items-center gap-2 rounded-2xl bg-[#184B340a] p-4 text-sm font-bold text-[#184B34]" role="status">
                    <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
                    Cargando los datos actuales de tu perfil…
                  </p>
                ) : null}

                <fieldset className="grid gap-5" disabled={isLoading || isSubmitting}>
                  <legend className="sr-only">Campos editables del perfil</legend>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="settings-name">Nombre</label>
                      <input
                        aria-invalid={hasError || undefined}
                        autoComplete="name"
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
                    <label className="label" htmlFor="settings-bio">Biografía</label>
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
                </fieldset>

                <BackendPendingAlert
                  className="mt-5"
                  compact
                  description="El contrato anuncia un pueblo favorito, pero el backend actual descarta ese valor y no lo persiste. La edición permanecerá deshabilitada hasta que exista almacenamiento real."
                  title="Pueblo favorito pendiente de backend"
                />

                {error ? <p className="mt-5 rounded-2xl border border-[#C96D4A33] bg-[#C96D4A12] p-4 text-sm font-bold text-[#873E29]" role="alert">{error}</p> : null}
                {success ? <p className="mt-5 flex items-center gap-2 rounded-2xl border border-[#347A4830] bg-[#347A4810] p-4 text-sm font-bold text-[#184B34]" role="status"><CheckCircle2 aria-hidden="true" className="size-5" />{success}</p> : null}

                <div className="mt-6 flex justify-end">
                  <Button className="w-full sm:w-auto" disabled={isLoading || isSubmitting} type="submit">
                    {isSubmitting ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin" /> : <Save aria-hidden="true" className="size-4" />}
                    {isSubmitting ? "Guardando…" : "Guardar cambios"}
                  </Button>
                </div>
              </form>
            </Card>
          </section>

          <SettingsSection
            description="El email es de solo lectura. Puedes editar tu nombre de usuario en la sección Perfil."
            icon={AtSign}
            id="account"
            title="Cuenta"
          >
            <dl className="grid gap-3 sm:grid-cols-2">
              <ReadOnlyAccountItem icon={Mail} label="Email" value={form.email || "No disponible"} />
              <ReadOnlyAccountItem icon={AtSign} label="Usuario" value={form.username ? `@${form.username.replace(/^@/, "")}` : "No disponible"} />
            </dl>
            <BackendPendingAlert
              className="mt-4"
              compact
              description="Cambiar o recuperar la contraseña y gestionar credenciales requiere endpoints de cuenta que todavía no están disponibles. No se enviará ningún correo desde esta pantalla."
              title="Gestión de credenciales pendiente"
            />
          </SettingsSection>

          <SettingsSection
            description="Estructura prevista para controlar qué datos podrían mostrarse en un futuro perfil público."
            icon={Eye}
            id="privacy"
            title="Privacidad"
          >
            <BackendPendingAlert
              compact
              description="Estas preferencias se habilitarán cuando el backend pueda aplicar la privacidad en el perfil público."
              title="Preferencias de privacidad no disponibles"
            />
            <div className="mt-4 grid gap-2">
              {[
                "Mostrar pueblo de origen",
                "Mostrar residencia",
                "Mostrar intereses",
                "Mostrar actividades organizadas",
                "Mostrar pueblos seguidos",
              ].map((label) => <DisabledPreference key={label} label={label} />)}
            </div>
          </SettingsSection>

          <SettingsSection
            description="Preferencias futuras para avisos dentro de la comunidad."
            icon={Bell}
            id="notifications"
            title="Notificaciones"
          >
            <BackendPendingAlert
              compact
              description="El backend de notificaciones todavía no existe. Estos controles están deshabilitados y no guardan valores ni simulan envíos por email o push."
              title="Preferencias de notificación pendientes"
            />
            <div className="mt-4 grid gap-2">
              {[
                "Novedades de pueblos seguidos",
                "Recordatorios de actividades",
                "Interacciones en publicaciones",
              ].map((label) => <DisabledPreference key={label} label={label} />)}
            </div>
          </SettingsSection>

          <SettingsSection
            description="Capacidades de protección que necesitan soporte específico del servicio."
            icon={ShieldCheck}
            id="security"
            title="Seguridad"
          >
            <BackendPendingAlert
              compact
              description="Cambio de contraseña, sesiones activas, autenticación de dos factores, recuperación, exportación y eliminación de cuenta no tienen endpoints disponibles. No se exponen tokens ni datos técnicos."
              title="Herramientas de seguridad pendientes"
            />
          </SettingsSection>

          <SettingsSection
            description="Compatibilidad frontend disponible sin crear preferencias remotas ficticias."
            icon={Accessibility}
            id="accessibility"
            title="Accesibilidad"
          >
            <div className="grid gap-3 sm:grid-cols-2">
              <AccessibilityItem
                description="Las animaciones y transiciones se reducen cuando así lo indica tu sistema."
                icon={Move}
                title="Movimiento reducido"
              />
              <AccessibilityItem
                description="Los controles y secciones principales se pueden recorrer y activar con teclado."
                icon={Keyboard}
                title="Navegación por teclado"
              />
              <AccessibilityItem
                description="Puedes usar el zoom y el tamaño de texto de tu navegador; no guardamos una escala paralela."
                icon={Type}
                title="Tamaño de texto"
              />
              <AccessibilityItem
                description="Los estados incluyen texto e iconos para no depender únicamente del color."
                icon={Eye}
                title="Lectura de estados"
              />
            </div>
          </SettingsSection>
        </div>
      </div>
    </AuthGate>
  );
}

function SettingsHeading({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex items-start gap-3 border-b border-[#184B3414] p-5 sm:p-6">
      <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#184B340c] text-[#347A48]">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div>
        <h2 className="text-xl font-extrabold text-[#0E3325]">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[#687269]">{description}</p>
      </div>
    </div>
  );
}

function SettingsSection({
  children,
  description,
  icon,
  id,
  title,
}: {
  children: ReactNode;
  description: string;
  icon: LucideIcon;
  id: Exclude<SettingsSectionId, "profile">;
  title: string;
}) {
  return (
    <section className="scroll-mt-28" id={`settings-${id}`}>
      <Card className="overflow-hidden">
        <SettingsHeading description={description} icon={icon} title={title} />
        <div className="p-5 sm:p-6">{children}</div>
      </Card>
    </section>
  );
}

function ReadOnlyAccountItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-[#184B3414] bg-[#F8F5EE] p-4">
      <dt className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[#687269]">
        <Icon aria-hidden="true" className="size-4" />
        {label}
      </dt>
      <dd className="mt-2 break-words text-sm font-extrabold text-[#18231D]">{value}</dd>
    </div>
  );
}

function DisabledPreference({ label }: { label: string }) {
  return (
    <div aria-disabled="true" className="flex min-h-16 items-center justify-between gap-4 rounded-2xl border border-[#184B3412] bg-[#F8F5EE] px-4 py-3 opacity-75">
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-[#39483E]">{label}</p>
        <p className="mt-0.5 text-xs font-medium text-[#687269]">Pendiente de soporte en backend</p>
      </div>
      <button
        aria-label={`${label}: deshabilitado, pendiente de backend`}
        className="relative h-7 w-12 shrink-0 cursor-not-allowed rounded-full bg-[#CFCFC7]"
        disabled
        type="button"
      >
        <span aria-hidden="true" className="absolute left-1 top-1 size-5 rounded-full bg-white shadow-sm" />
      </button>
    </div>
  );
}

function AccessibilityItem({
  description,
  icon: Icon,
  title,
}: {
  description: string;
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-[#184B3414] bg-[#F8F5EE] p-4">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#347A48] shadow-sm">
        <Icon aria-hidden="true" className="size-4.5" />
      </span>
      <div>
        <h3 className="text-sm font-extrabold text-[#18231D]">{title}</h3>
        <p className="mt-1 text-xs font-medium leading-5 text-[#687269]">{description}</p>
      </div>
    </div>
  );
}
