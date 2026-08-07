import Link from "next/link";
import { LogIn, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buildAuthHref } from "@/features/auth/next-path";
import { getTranslations } from "@/lib/i18n/get-translations";

/**
 * Honest compact CTA shown to spectators in place of gated social content
 * (village community wall/voices, activity join/save actions, etc.).
 */
export async function SpectatorCtaCard({
  description,
  returnTo,
  title,
}: {
  description: string;
  returnTo: string;
  title: string;
}) {
  const { t } = await getTranslations();

  return (
    <Card className="p-6 text-center sm:p-8">
      <p className="text-lg font-extrabold leading-7 text-[#18231D]">{title}</p>
      <p className="mt-2 text-sm leading-6 text-[#677168]">{description}</p>
      <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0E3325]"
          href={buildAuthHref("/login", returnTo)}
        >
          <LogIn aria-hidden="true" className="size-4" />
          {t("auth.signIn")}
        </Link>
        <Link
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#184B3424] bg-white/88 px-5 py-2.5 text-sm font-extrabold text-[#184B34] hover:bg-white"
          href={buildAuthHref("/register", returnTo)}
        >
          <UserPlus aria-hidden="true" className="size-4" />
          {t("auth.createAccount")}
        </Link>
      </div>
    </Card>
  );
}
