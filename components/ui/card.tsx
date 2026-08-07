import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[22px] border border-[#184B341a] bg-[#FFFCF7]/94 shadow-[0_14px_42px_rgba(43,55,38,0.07)] backdrop-blur-sm",
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
        "inline-flex items-center rounded-full bg-[#D7A63C26] px-3 py-1 text-xs font-extrabold text-[#184B34]",
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
        <p className="eyebrow mb-2">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-2xl font-extrabold tracking-[-0.025em] text-[#18231D] sm:text-3xl md:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-base leading-7 text-[#677168]">{description}</p>
      ) : null}
    </div>
  );
}
