import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { cn } from "@/lib/utils";

/**
 * Chrome for a visitor without a session: header only, no private sidebar,
 * no two/three-column layout reserved for authenticated widgets. `Navbar`
 * itself also renders its public variant once `isAuthenticated` is false, so
 * this component only owns the page container around it.
 */
export function PublicSpectatorShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <>
      <Navbar />
      <main className={cn("page-shell py-4 pb-10 md:py-5", className)}>
        {children}
      </main>
    </>
  );
}
