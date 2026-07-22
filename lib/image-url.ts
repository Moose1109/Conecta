import { API_BASE_URL } from "@/lib/api/client";

const allowedHttpsHosts = new Set([
  "api-conextapueblos.onrender.com",
  "images.unsplash.com",
]);
const allowedHttpHosts = new Set([
  "127.0.0.1",
  "192.168.1.172",
  "localhost",
]);

export function isRenderableImageUrl(value: string) {
  const text = value.trim();

  if (text.startsWith("/images/")) return true;

  try {
    const url = new URL(text);
    return (
      (url.protocol === "https:" && allowedHttpsHosts.has(url.hostname)) ||
      (url.protocol === "http:" && allowedHttpHosts.has(url.hostname))
    );
  } catch {
    return false;
  }
}

export function toRenderableImageUrl(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return undefined;

  const text = value.trim();
  if (isRenderableImageUrl(text)) return text;

  if (text.startsWith("/") && API_BASE_URL) {
    try {
      const absoluteUrl = new URL(text, `${API_BASE_URL.replace(/\/+$/, "")}/`).toString();
      return isRenderableImageUrl(absoluteUrl) ? absoluteUrl : undefined;
    } catch {
      return undefined;
    }
  }

  return undefined;
}
