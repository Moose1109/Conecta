"use client";

import { AlertTriangle, LoaderCircle, Sparkles } from "lucide-react";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { PrototypeBanner } from "@/components/ui/prototype-banner";
import { MomentCard } from "@/features/moments/moment-card";
import { momentSubtypeStyles } from "@/features/moments/moment-subtype-style";
import { MomentViewer } from "@/features/moments/moment-viewer";
import {
  conceptMoments,
  momentSubtypeLabels,
  momentSubtypeOrder,
  type MomentSubtype,
  type MomentsConceptState,
} from "@/features/moments/moments-concept-data";
import { cn } from "@/lib/utils";

type MomentFilter = "all" | MomentSubtype;

const filterOrder = ["all", ...momentSubtypeOrder] satisfies MomentFilter[];

export function MomentsView({
  initialState = "ready",
}: {
  initialState?: MomentsConceptState;
}) {
  const [filter, setFilter] = useState<MomentFilter>("all");
  const [viewerIndex, setViewerIndex] = useState<number>();
  const tabRefs = useRef<Record<MomentFilter, HTMLButtonElement | null>>({
    ahora: null,
    all: null,
    aviso: null,
    consejo: null,
    plan: null,
    postal: null,
    recuerdo: null,
  });
  const openTriggerRef = useRef<HTMLButtonElement | null>(null);

  const filteredMoments = useMemo(
    () => (filter === "all" ? conceptMoments : conceptMoments.filter((moment) => moment.subtype === filter)),
    [filter],
  );

  function selectFilter(nextFilter: MomentFilter) {
    setFilter(nextFilter);
    setViewerIndex(undefined);
    tabRefs.current[nextFilter]?.focus();
  }

  function handleFilterKeyDown(event: KeyboardEvent<HTMLButtonElement>, currentFilter: MomentFilter) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const currentIndex = filterOrder.indexOf(currentFilter);
    const nextIndex = event.key === "Home"
      ? 0
      : event.key === "End"
        ? filterOrder.length - 1
        : (currentIndex + (event.key === "ArrowRight" ? 1 : -1) + filterOrder.length) % filterOrder.length;
    selectFilter(filterOrder[nextIndex]);
  }

  if (initialState !== "ready") {
    return <MomentsConceptStateView state={initialState} />;
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-4">
      <PrototypeBanner
        description="Autores, pueblos, textos e imágenes son ejemplos locales. Nada se publica, reacciona ni persiste."
        title="Vista conceptual · Momentos requiere backend"
      />

      <div>
        <p className="eyebrow">Propuesta visual</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-text-primary sm:text-4xl">
          Momentos
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
          Una demostración de diseño para compartir instantes de la vida del pueblo: Ahora, Postal, Recuerdo,
          Plan, Consejo y Aviso. Ningún Momento de esta vista es real.
        </p>
      </div>

      <div
        aria-label="Filtros de subtipo de Momentos"
        className="flex min-w-0 gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
      >
        {filterOrder.map((item) => {
          const selected = item === filter;
          const style = item === "all" ? undefined : momentSubtypeStyles[item];
          const Icon = style?.icon;

          return (
            <button
              key={item}
              ref={(element) => {
                tabRefs.current[item] = element;
              }}
              aria-controls="moments-grid"
              aria-selected={selected}
              className={cn(
                "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-full border px-4 text-xs font-extrabold transition-colors",
                selected
                  ? "border-primary bg-primary text-primary-foreground shadow-sm"
                  : "border-border bg-white text-text-muted hover:border-[#184B3430] hover:text-primary",
              )}
              id={`moments-filter-${item}`}
              role="tab"
              tabIndex={selected ? 0 : -1}
              type="button"
              onClick={() => selectFilter(item)}
              onKeyDown={(event) => handleFilterKeyDown(event, item)}
            >
              {Icon ? <Icon aria-hidden="true" className="size-3.5" /> : null}
              {item === "all" ? "Todos" : momentSubtypeLabels[item]}
            </button>
          );
        })}
      </div>

      <div aria-labelledby={`moments-filter-${filter}`} id="moments-grid" role="tabpanel" tabIndex={0}>
        {filteredMoments.length ? (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredMoments.map((moment, index) => (
              <MomentCard
                key={moment.id}
                moment={moment}
                onOpen={(trigger) => {
                  openTriggerRef.current = trigger;
                  setViewerIndex(index);
                }}
              />
            ))}
          </ul>
        ) : (
          <div className="grid min-h-[240px] place-items-center rounded-[22px] border border-dashed border-border bg-white px-6 py-10 text-center">
            <div className="max-w-xs">
              <p className="text-sm font-extrabold text-text-primary">Sin ejemplos en este subtipo</p>
              <p className="mt-2 text-xs leading-5 text-text-muted">
                Prueba otro filtro para seguir recorriendo la propuesta visual.
              </p>
            </div>
          </div>
        )}
      </div>

      {viewerIndex !== undefined && filteredMoments[viewerIndex] ? (
        <MomentViewer
          index={viewerIndex}
          moments={filteredMoments}
          triggerRef={openTriggerRef}
          onClose={() => setViewerIndex(undefined)}
          onStepBy={(delta) =>
            setViewerIndex((current) => {
              if (current === undefined) return current;
              const next = current + delta;
              return next >= 0 && next < filteredMoments.length ? next : current;
            })
          }
        />
      ) : null}
    </div>
  );
}

function MomentsConceptStateView({ state }: { state: Exclude<MomentsConceptState, "ready"> }) {
  const content = state === "loading"
    ? {
        description: "Esta variante permite revisar el esqueleto de la futura cuadrícula sin temporizadores ni peticiones simuladas.",
        eyebrow: "Estado conceptual",
        icon: LoaderCircle,
        title: "Preparando los Momentos de ejemplo",
      }
    : state === "error"
      ? {
          description: "No se ha consultado ningún endpoint. Esta variante documenta cómo se comunicaría un error real cuando exista la integración.",
          eyebrow: "Variante de error",
          icon: AlertTriangle,
          title: "No se pudo mostrar la demostración",
        }
      : {
          description: "Esta variante conceptual representa un pueblo o una cuenta sin Momentos todavía cuando exista el servicio real.",
          eyebrow: "Variante vacía",
          icon: Sparkles,
          title: "Aún no hay Momentos",
        };
  const Icon = content.icon;

  return (
    <div className="flex min-h-0 min-w-0 flex-col gap-4">
      <PrototypeBanner
        description="Autores, pueblos, textos e imágenes son ejemplos locales. Nada se publica, reacciona ni persiste."
        title="Vista conceptual · Momentos requiere backend"
      />
      <div className="rounded-[22px] border border-border bg-white p-5 sm:p-8">
        <p className="eyebrow">Propuesta visual</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-0.04em] text-text-primary sm:text-4xl">
          Momentos
        </h1>
        <div aria-busy={state === "loading"} className="grid min-h-[50vh] place-items-center px-2 py-8 text-center">
          <div className="max-w-md">
            <span className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[#78947D1f] text-primary">
              <Icon aria-hidden="true" className={cn("size-7", state === "loading" && "animate-spin")} />
            </span>
            <p className="eyebrow mt-5">{content.eyebrow}</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-[-0.025em] text-text-primary">
              {content.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-text-muted">{content.description}</p>
            {state === "loading" ? (
              <div aria-hidden="true" className="mx-auto mt-6 grid max-w-sm grid-cols-2 gap-3">
                {[0, 1, 2, 3].map((item) => (
                  <div className="grid gap-2 rounded-[18px] border border-border p-3" key={item}>
                    <span className="skeleton-shimmer block aspect-[4/3] w-full rounded-xl" />
                    <span className="skeleton-shimmer block h-3 w-4/5 rounded-full" />
                    <span className="skeleton-shimmer block h-3 w-2/3 rounded-full" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
