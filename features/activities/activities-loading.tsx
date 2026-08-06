import { Card } from "@/components/ui/card";
import { getTranslations } from "@/lib/i18n/get-translations";

export async function ActivitiesPageSkeleton() {
  const { t } = await getTranslations();

  return (
    <div aria-busy="true" aria-label={t("activities.loadingAgendaAria")}>
      <div className="grid min-h-[310px] overflow-hidden rounded-[28px] bg-[#0E3325] lg:grid-cols-[0.86fr_1.14fr]">
        <div className="p-8 lg:p-10">
          <div className="skeleton-shimmer h-7 w-32 rounded-full bg-white/12" />
          <div className="skeleton-shimmer mt-6 h-10 w-3/4 rounded-2xl bg-white/12" />
          <div className="skeleton-shimmer mt-3 h-10 w-1/2 rounded-2xl bg-white/12" />
          <div className="skeleton-shimmer mt-6 h-4 w-full rounded-full bg-white/10" />
          <div className="skeleton-shimmer mt-2 h-4 w-4/5 rounded-full bg-white/10" />
          <div className="skeleton-shimmer mt-6 h-11 w-44 rounded-full bg-white/12" />
        </div>
        <div className="skeleton-shimmer min-h-[285px] bg-[#78947D33] lg:min-h-[310px]" />
      </div>

      <div className="mt-8">
        <div className="skeleton-shimmer h-4 w-32 rounded-full" />
        <div className="skeleton-shimmer mt-3 h-8 w-72 max-w-full rounded-full" />
        <Card className="mt-5 p-4">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_240px]">
            <div className="skeleton-shimmer h-12 rounded-2xl" />
            <div className="skeleton-shimmer h-12 rounded-2xl" />
          </div>
          <div className="mt-3 flex gap-2">
            {Array.from({ length: 5 }, (_, index) => (
              <div className="skeleton-shimmer h-9 w-24 rounded-full" key={index} />
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, index) => (
          <Card className="overflow-hidden" key={index}>
            <div className="skeleton-shimmer aspect-[16/9]" />
            <div className="p-4">
              <div className="skeleton-shimmer h-3 w-24 rounded-full" />
              <div className="skeleton-shimmer mt-3 h-6 w-4/5 rounded-full" />
              <div className="skeleton-shimmer mt-2 h-6 w-3/5 rounded-full" />
              <div className="skeleton-shimmer mt-4 h-3 w-full rounded-full" />
              <div className="skeleton-shimmer mt-2 h-3 w-4/5 rounded-full" />
              <div className="mt-5 flex justify-end gap-2 border-t border-[#184B3414] pt-4">
                <div className="skeleton-shimmer h-8 w-20 rounded-full" />
                <div className="skeleton-shimmer h-8 w-24 rounded-full" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <span className="sr-only">{t("activities.loadingAgendaSr")}</span>
    </div>
  );
}
