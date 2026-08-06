import type { Metadata } from "next";
import { AuthLanding } from "@/features/auth/auth-landing";
import { getTranslations } from "@/lib/i18n/get-translations";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslations();
  return { title: t("auth.createAccount") };
}

export default function RegisterPage() {
  return <AuthLanding initialMode="register" />;
}
