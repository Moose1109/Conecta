import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-[#1F3D2B14] bg-white/86 shadow-[0_16px_44px_rgba(31,61,43,0.075)]",
        className,
      )}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full bg-[#D9A44124] px-3 py-1 text-xs font-bold text-[#1F3D2B]",
        className,
      )}
      {...props}
    />
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-6 max-w-2xl md:mb-8">
      {eyebrow ? (
        <p className="mb-2 text-sm font-extrabold uppercase tracking-[0.18em] text-[#3A7D44]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-black text-[#1F3D2B] sm:text-3xl md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-base leading-7 text-[#1E1E1E]/70">{description}</p>
      ) : null}
    </div>
  );
}
