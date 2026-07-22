"use client";

import Link from "next/link";
import { LoaderCircle, LockKeyhole, RefreshCw, ShieldAlert, ShieldX } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { isAdminUser } from "@/features/auth/roles";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { getCurrentUser } from "@/lib/api/auth.service";
import { isUnauthorizedError } from "@/lib/api/client";
import { logApiIssue } from "@/lib/api/error-message";
import { clearSession, saveSession } from "@/lib/api/session";

type SessionVerification = {
  status: "checking" | "allowed" | "denied" | "error";
  adminOnly?: boolean;
  token?: string;
};

export function AuthGate({
  adminOnly = false,
  children,
  message = "Para acceder a tu espacio personal necesitas iniciar sesión.",
}: {
  adminOnly?: boolean;
  children: ReactNode;
  message?: string;
}) {
  const { token } = useAuthSession();
  const [verificationAttempt, setVerificationAttempt] = useState(0);
  const [sessionVerification, setSessionVerification] = useState<SessionVerification>({
    status: "checking",
  });

  useEffect(() => {
    if (!token) {
      return;
    }

    let active = true;

    getCurrentUser(token)
      .then((currentUser) => {
        if (!active) {
          return;
        }

        if (!currentUser) {
          setSessionVerification({ status: "error", token, adminOnly });
          return;
        }

        saveSession({ token, user: currentUser });
        setSessionVerification({
          status: adminOnly && !isAdminUser(currentUser) ? "denied" : "allowed",
          token,
          adminOnly,
        });
      })
      .catch((error) => {
        logApiIssue("Unable to verify the current session", error);
        if (!active) {
          return;
        }
        if (isUnauthorizedError(error)) {
          clearSession();
          return;
        }
        setSessionVerification({ status: "error", token, adminOnly });
      });

    return () => {
      active = false;
    };
  }, [adminOnly, token, verificationAttempt]);

  if (!token) {
    return (
      <Card className="mx-auto max-w-xl p-7 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#D7A63C24] text-[#184B34]"><LockKeyhole aria-hidden="true" className="size-6" /></span>
        <p className="eyebrow mt-5">
          Acceso privado
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#18231D]">
          Necesitas iniciar sesión
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#687269]">{message}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0E3325]"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#184B3424] bg-white/88 px-5 py-2.5 text-sm font-extrabold text-[#184B34] hover:bg-white"
          >
            Crear cuenta
          </Link>
        </div>
      </Card>
    );
  }

  const verificationStatus =
    sessionVerification.token === token &&
    sessionVerification.adminOnly === adminOnly
      ? sessionVerification.status
      : "checking";

  if (verificationStatus === "checking") {
    return (
      <Card
        aria-live="polite"
        className="mx-auto max-w-xl p-7 text-center"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#D7A63C24] text-[#184B34]">
          <LoaderCircle aria-hidden="true" className="size-6 animate-spin" />
        </span>
        <p className="eyebrow mt-5">Comprobando sesión</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#18231D]">
          {adminOnly ? "Verificando tus permisos" : "Verificando tu cuenta"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#687269]">
          {adminOnly
            ? "Estamos confirmando tu cuenta antes de abrir el panel de administración."
            : "Estamos confirmando que tu sesión sigue activa antes de mostrar este contenido."}
        </p>
      </Card>
    );
  }

  if (verificationStatus === "error") {
    return (
      <Card
        aria-live="polite"
        className="mx-auto max-w-xl p-7 text-center"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#C96D4A1f] text-[#A95539]">
          <ShieldAlert aria-hidden="true" className="size-6" />
        </span>
        <p className="eyebrow mt-5">Verificación interrumpida</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#18231D]">
          {adminOnly
            ? "No hemos podido confirmar tus permisos"
            : "No hemos podido confirmar tu sesión"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#687269]">
          El servicio de autenticación no está disponible ahora mismo. Puedes volver
          a intentarlo sin cerrar tu sesión.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0E3325]"
            type="button"
            onClick={() => {
              setSessionVerification({ status: "checking", token, adminOnly });
              setVerificationAttempt((attempt) => attempt + 1);
            }}
          >
            <RefreshCw aria-hidden="true" className="size-4" />
            Reintentar
          </button>
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#184B3424] bg-white/88 px-5 py-2.5 text-sm font-extrabold text-[#184B34] hover:bg-white"
            onClick={clearSession}
          >
            Volver a iniciar sesión
          </Link>
        </div>
      </Card>
    );
  }

  if (adminOnly && verificationStatus === "denied") {
    return (
      <Card className="mx-auto max-w-xl p-7 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#C96D4A1f] text-[#A95539]"><ShieldX aria-hidden="true" className="size-6" /></span>
        <p className="eyebrow mt-5">
          Acceso restringido
        </p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-[-0.035em] text-[#18231D]">
          Panel admin no disponible
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#687269]">
          Esta sección está reservada para usuarios admin o superadmin.
        </p>
        <div className="mt-6">
          <Link
            href="/community"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0E3325]"
          >
            Ir a comunidad
          </Link>
        </div>
      </Card>
    );
  }

  return children;
}
