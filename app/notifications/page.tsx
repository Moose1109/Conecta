import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { AuthGate } from "@/features/auth/auth-gate";
import { NotificationsView } from "@/features/notifications/notifications-view";

export const metadata: Metadata = { title: "Notificaciones" };

export default function NotificationsPage() {
  return (
    <AuthenticatedShell>
      <AuthGate message="Para ver tus notificaciones necesitas iniciar sesión.">
        <NotificationsView />
      </AuthGate>
    </AuthenticatedShell>
  );
}
