import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/navbar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { SocialLayout } from "@/components/layout/social-layout";
import { cn } from "@/lib/utils";

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
