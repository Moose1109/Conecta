"use client";

import Image, { type ImageProps } from "next/image";
import { useState, type ReactNode } from "react";

/**
 * Renders a real (backend-provided) image, falling back to `fallback` both
 * when no URL is available and when the remote host fails to respond (e.g.
 * a timed-out image host) — so a single broken remote image never leaves an
 * empty gap or breaks the surrounding card.
 */
export function RemoteEntityImage({
  src,
  alt,
  fallback,
  ...imageProps
}: Omit<ImageProps, "src"> & { src?: string; fallback: ReactNode }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) return <>{fallback}</>;

  return <Image {...imageProps} alt={alt} src={src} onError={() => setFailed(true)} />;
}
