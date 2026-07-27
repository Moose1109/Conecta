"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const COLLAPSIBLE_DESCRIPTION_LENGTH = 520;

export function VillageDescription({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const paragraphs = description
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const isLong = description.length > COLLAPSIBLE_DESCRIPTION_LENGTH || paragraphs.length > 3;

  return (
    <div>
      <div
        className={isLong && !expanded ? "relative max-h-52 overflow-hidden" : undefined}
        id="village-description-content"
      >
        <div className="grid max-w-3xl gap-4 text-base leading-8 text-[#687269]">
          {paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
          ))}
        </div>
        {isLong && !expanded ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#FFFCF7] to-transparent"
          />
        ) : null}
      </div>

      {isLong ? (
        <button
          aria-controls="village-description-content"
          aria-expanded={expanded}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#184B3420] bg-white px-4 text-sm font-extrabold text-[#184B34] transition-colors hover:bg-[#F7F2E8] focus:outline-none focus:ring-4 focus:ring-[#347A4824]"
          type="button"
          onClick={() => setExpanded((current) => !current)}
        >
          {expanded ? (
            <ChevronUp aria-hidden="true" className="size-4" />
          ) : (
            <ChevronDown aria-hidden="true" className="size-4" />
          )}
          {expanded ? "Mostrar menos" : "Leer más"}
        </button>
      ) : null}
    </div>
  );
}
