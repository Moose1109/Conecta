import { MapPinned, Signpost } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getTranslations } from "@/lib/i18n/get-translations";

export default async function NotFound() {
  const { t } = await getTranslations();

  return (
    <>
      <Navbar />
      <main className="page-shell grid min-h-[calc(100dvh-72px)] place-items-center py-12">
        <Card className="relative w-full max-w-2xl overflow-hidden p-8 text-center sm:p-12">
          <div aria-hidden="true" className="topographic-pattern absolute inset-0 opacity-20" />
          <div className="relative">
            <span className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[#D7A63C24] text-[#184B34]"><MapPinned aria-hidden="true" className="size-7" /></span>
            <p className="eyebrow mt-5">{t("errors.notFound.eyebrow")}</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-[-0.045em] text-[#0E3325] sm:text-5xl">{t("errors.notFound.title")}</h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#687269]">{t("errors.notFound.description")}</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href="/community"><Signpost aria-hidden="true" className="size-4" />{t("common.backendPending.actionLabel")}</LinkButton>
              <LinkButton href="/villages" variant="secondary">{t("errors.notFound.exploreVillagesAction")}</LinkButton>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
