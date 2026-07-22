import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { SettingsView } from "@/features/profile/settings-view";

export const metadata: Metadata = { title: "Editar perfil" };

export default function SettingsPage() {
  return <AuthenticatedShell><SettingsView /></AuthenticatedShell>;
}
