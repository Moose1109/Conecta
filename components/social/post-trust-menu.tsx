"use client";

import { TrustActionsMenu } from "@/features/trust/trust-actions-menu";

export function PostTrustMenu() {
  return (
    <TrustActionsMenu
      contentLabel="esta publicación"
      triggerAriaLabel="Opciones de la publicación"
    />
  );
}
