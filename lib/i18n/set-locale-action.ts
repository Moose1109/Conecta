"use server";

import { cookies } from "next/headers";
import {
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
} from "@/lib/i18n/config";

/**
 * Persists the chosen interface language as a functional, non-sensitive
 * cookie. The caller is responsible for triggering a router refresh so
 * Server Components re-render with the new locale.
 */
export async function setLocaleAction(requestedLocale: string): Promise<void> {
  const locale = normalizeLocale(requestedLocale);
  const store = await cookies();

  store.set(LOCALE_COOKIE_NAME, locale, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });
}
