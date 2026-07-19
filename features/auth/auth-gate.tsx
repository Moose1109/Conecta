"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { isAdminUser } from "@/features/auth/roles";
import { useAuthSession } from "@/features/auth/use-auth-session";

export function AuthGate({
  adminOnly = false,
  children,
  message = "Para acceder a tu espacio personal necesitas iniciar sesión.",
}: {
  adminOnly?: boolean;
  children: ReactNode;
  message?: string;
}) {
  const { token, user } = useAuthSession();

  if (!token) {
    return (
      <Card className="mx-auto max-w-xl p-7 text-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#3A7D44]">
          Acceso privado
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#1F3D2B]">
          Necesitas iniciar sesión
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/70">{message}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#3A7D44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2f6738]"
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#1F3D2B24] bg-white/88 px-5 py-2.5 text-sm font-bold text-[#1F3D2B] hover:bg-white"
          >
            Crear cuenta
          </Link>
        </div>
      </Card>
    );
  }

  if (adminOnly && !isAdminUser(user)) {
    return (
      <Card className="mx-auto max-w-xl p-7 text-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#3A7D44]">
          Acceso restringido
        </p>
        <h1 className="mt-3 text-3xl font-black text-[#1F3D2B]">
          Panel admin no disponible
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/70">
          Esta sección está reservada para usuarios admin o superadmin.
        </p>
        <div className="mt-6">
          <Link
            href="/community"
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#3A7D44] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#2f6738]"
          >
            Ir a comunidad
          </Link>
        </div>
      </Card>
    );
  }

  return children;
}
