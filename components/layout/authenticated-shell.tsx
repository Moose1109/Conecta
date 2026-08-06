"use client";

import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { PublicSpectatorShell } from "@/components/layout/public-spectator-shell";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SocialLayout } from "@/components/layout/social-layout";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { cn } from "@/lib/utils";

/**
 * Shared page shell for the 13 app routes that were built for authenticated
 * members. Branches purely on session state: with a token it renders the
 * full member chrome (sidebar, three-column layouts) unchanged; without one
 * it delegates to `PublicSpectatorShell` so a spectator never receives the
 * private sidebar or member-only layout, regardless of which route they're
 * on. Any per-route content that's still safe to show a spectator (public
 * village/activity listings, public detail pages) renders as `children`
 * either way — only the surrounding chrome differs.
 */
export function AuthenticatedShell({
  children,
  className,
  leftExtra,
  right,
  variant = "two-column",
}: {
  children: ReactNode;
  className?: string;
  leftExtra?: ReactNode;
  right?: ReactNode;
  variant?: "two-column" | "three-column";
}) {
  const { token } = useAuthSession();

  if (!token) {
    return <PublicSpectatorShell className={className}>{children}</PublicSpectatorShell>;
  }

  return (
    <>
      <Navbar />
      <main
        className={cn(
          "page-shell py-4 pb-24 md:py-5 lg:pb-10",
          className,
        )}
      >
        <SocialLayout
          left={
            <div className="grid content-start gap-4">
              <SidebarNav />
              {leftExtra}
            </div>
          }
          right={right}
          variant={variant}
        >
          {children}
        </SocialLayout>
      </main>
    </>
  );
}
