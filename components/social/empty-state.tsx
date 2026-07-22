import Link from "next/link";
import { Compass, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
  onAction,
  icon: Icon = Compass,
}: {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: LucideIcon;
}) {
  return (
    <Card className="p-7 text-center sm:p-9">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#78947D1f] text-[#184B34]">
        <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
      </span>
      <h2 className="mt-5 text-xl font-extrabold tracking-[-0.02em] text-[#18231D]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#687269]">{description}</p>
      {onAction && actionLabel ? (
        <button
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-[#0E3325]"
          onClick={onAction}
          type="button"
        >
          {actionLabel}
        </button>
      ) : actionHref && actionLabel ? (
        <Link
          className="mt-5 inline-flex min-h-11 items-center justify-center rounded-full bg-[#184B34] px-5 py-2.5 text-sm font-extrabold text-white transition-colors hover:bg-[#0E3325]"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      ) : null}
    </Card>
  );
}
