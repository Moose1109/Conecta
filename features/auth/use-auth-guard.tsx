"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useState } from "react";
import { AuthRequiredModal } from "@/features/auth/auth-required-modal";
import { useAuthSession } from "@/features/auth/use-auth-session";

export function useAuthGuard() {
  const { token, user } = useAuthSession();
  const pathname = usePathname();
  const [message, setMessage] = useState("");

  function requireAuth(message: string, action: () => void | Promise<void>) {
    if (!token) {
      setMessage(message);
      return;
    }

    return action();
  }

  const returnTo = `${pathname}${
    typeof window !== "undefined" ? `${window.location.search}${window.location.hash}` : ""
  }`;

  const authModal: ReactNode = (
    <AuthRequiredModal
      open={Boolean(message)}
      message={message}
      returnTo={returnTo}
      onClose={() => setMessage("")}
    />
  );

  return {
    authModal,
    isAuthenticated: Boolean(token),
    requireAuth,
    user,
  };
}
