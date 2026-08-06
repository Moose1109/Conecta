"use client";

import type { ReactNode } from "react";
import { useAuthSession } from "@/features/auth/use-auth-session";

/**
 * Picks between two pre-rendered subtrees based on session state, so a
 * server-rendered detail page can hide operative/social content from
 * spectators without duplicating the whole page as a client component.
 */
export function AuthVariant({
  authenticated,
  guest,
}: {
  authenticated: ReactNode;
  guest: ReactNode;
}) {
  const { token } = useAuthSession();
  return <>{token ? authenticated : guest}</>;
}
