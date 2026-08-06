import { LoadingState } from "@/components/ui/loading-state";
import { getTranslations } from "@/lib/i18n/get-translations";

export default async function AppLoading() {
  const { t } = await getTranslations();

  return (
    <main className="page-shell py-6 sm:py-8">
      <div className="mb-6">
        <div className="skeleton-shimmer h-4 w-28 rounded-full" />
        <div className="skeleton-shimmer mt-3 h-10 w-80 max-w-full rounded-full" />
      </div>
      <LoadingState label={t("common.appLoadingLabel")} variant="post" />
    </main>
  );
}
