import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end md:mb-8">
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#3A7D44]">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="text-3xl font-black leading-tight text-[#1F3D2B] sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 text-base leading-7 text-[#1E1E1E]/70">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
