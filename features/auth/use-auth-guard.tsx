"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { AuthRequiredModal } from "@/features/auth/auth-required-modal";
import { useAuthSession } from "@/features/auth/use-auth-session";

export function useAuthGuard() {
  const { token, user } = useAuthSession();
  const [message, setMessage] = useState("");

  function requireAuth(message: string, action: () => void | Promise<void>) {
    if (!token) {
      setMessage(message);
      return;
    }

    return action();
  }

  const authModal: ReactNode = (
    <AuthRequiredModal
      open={Boolean(message)}
      message={message}
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
