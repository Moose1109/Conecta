"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useAuthSession } from "@/features/auth/use-auth-session";

export function DashboardHeader({ fallbackName = "Usuario" }: { fallbackName?: string }) {
  const { user } = useAuthSession();
  const name = user?.name ?? fallbackName;
  const firstName = name.split(" ")[0] ?? name;

  return (
    <Card className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-[#3A7D44]">
            Comunidad
          </p>
          <h1 className="mt-1 text-2xl font-black leading-tight text-[#1F3D2B]">
            {firstName ? `Hola, ${firstName}` : "Hola"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#1E1E1E]/62">
            Publica, descubre conversaciones locales y salta rápido a actividades
            o pueblos desde tus atajos.
          </p>
        </div>
        <Link
          href="/community"
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#1F3D2B] px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-[#173322]"
        >
          Abrir comunidad
        </Link>
      </div>
    </Card>
  );
}
