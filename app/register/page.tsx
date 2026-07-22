import type { Metadata } from "next";
import { AuthLanding } from "@/features/auth/auth-landing";

export const metadata: Metadata = {
  title: "Crear cuenta",
};

export default function RegisterPage() {
  return <AuthLanding initialMode="register" />;
}
