import { Card } from "@/components/ui/card";

export function ExploreLoading() {
  return (
    <div aria-busy="true" aria-label="Cargando resultados de exploración">
      <Card className="p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
          <div className="skeleton-shimmer h-12 rounded-full" />
          <div className="skeleton-shimmer h-12 w-full rounded-full sm:w-32" />
        </div>
        <div className="mt-4 flex gap-2 overflow-hidden">
          {Array.from({ length: 4 }, (_, index) => (
            <div className="skeleton-shimmer h-11 w-28 shrink-0 rounded-full" key={index} />
          ))}
        </div>
      </Card>

      <div className="mt-7 grid gap-8">
        {Array.from({ length: 3 }, (_, sectionIndex) => (
          <section aria-label={`Cargando bloque ${sectionIndex + 1}`} key={sectionIndex}>
            <div className="skeleton-shimmer h-7 w-48 rounded-full" />
            <div className="skeleton-shimmer mt-2 h-4 w-72 max-w-full rounded-full" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }, (_, cardIndex) => (
                <Card className="overflow-hidden p-4" key={cardIndex}>
                  <div className="skeleton-shimmer aspect-[16/8] rounded-2xl" />
                  <div className="skeleton-shimmer mt-4 h-5 w-3/4 rounded-full" />
                  <div className="skeleton-shimmer mt-3 h-4 w-full rounded-full" />
                  <div className="skeleton-shimmer mt-2 h-4 w-4/5 rounded-full" />
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
      <span className="sr-only">Cargando pueblos, actividades y publicaciones</span>
    </div>
  );
}
