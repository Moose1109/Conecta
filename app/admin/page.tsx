import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { AdminDashboard } from "@/features/admin/admin-dashboard";
import { AuthGate } from "@/features/auth/auth-gate";

export const metadata: Metadata = { title: "Panel admin" };

export default function AdminPage() {
  return (
    <AuthenticatedShell>
      <AuthGate adminOnly message="Para acceder al panel admin necesitas iniciar sesión.">
        <AdminDashboard />
      </AuthGate>
    </AuthenticatedShell>
  );
}
