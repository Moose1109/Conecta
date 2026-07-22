import type { Metadata } from "next";
import { AuthLanding } from "@/features/auth/auth-landing";

export const metadata: Metadata = {
  title: "Iniciar sesión",
};

export default function LoginPage() {
  return <AuthLanding initialMode="login" />;
}
