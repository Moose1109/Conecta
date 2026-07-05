"use client";

import { PageHeader } from "@/components/ui/page-header";
import { useAuthSession } from "@/features/auth/use-auth-session";

export function DashboardHeader({ fallbackName = "Usuario" }: { fallbackName?: string }) {
  const { user } = useAuthSession();
  const name = user?.name ?? fallbackName;
  const firstName = name.split(" ")[0] ?? name;

  return (
    <PageHeader
      eyebrow="Mi espacio"
      title={firstName ? `Hola, ${firstName}` : "Hola"}
      description="Tu espacio personal para seguir publicaciones, actividades guardadas y pueblos que te interesan."
    />
  );
}
