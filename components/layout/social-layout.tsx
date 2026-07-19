import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SocialLayout({
  left,
  children,
  right,
  variant = "two-column",
}: {
  left?: ReactNode;
  children: ReactNode;
  right?: ReactNode;
  variant?: "two-column" | "three-column";
}) {
  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]",
        variant === "three-column" && "xl:grid-cols-[240px_minmax(0,1fr)_300px]",
      )}
    >
      {left ? <aside className="hidden min-w-0 lg:order-1 lg:block">{left}</aside> : null}
      <section className="order-1 min-w-0 lg:order-2">{children}</section>
      {right ? <aside className="order-3 min-w-0">{right}</aside> : null}
    </div>
  );
}
