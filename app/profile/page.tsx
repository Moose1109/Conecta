import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { ProfileView } from "@/features/profile/profile-view";

export const metadata: Metadata = {
  title: "Mi perfil",
};

export default function ProfilePage() {
  return (
    <AuthenticatedShell>
      <ProfileView />
    </AuthenticatedShell>
  );
}
