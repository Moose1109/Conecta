"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuthGuard } from "@/features/auth/use-auth-guard";
import { cn } from "@/lib/utils";

export function ProtectedLinkButton({
  children,
  className,
  href,
  message,
}: {
  children: ReactNode;
  className?: string;
  href: string;
  message: string;
}) {
  const { authModal, isAuthenticated, requireAuth } = useAuthGuard();

  if (isAuthenticated) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <>
      <button
        className={cn(className)}
        type="button"
        onClick={() => requireAuth(message, () => undefined)}
      >
        {children}
      </button>
      {authModal}
    </>
  );
}
