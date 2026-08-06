"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { createTranslator, type Translator } from "@/lib/i18n/translate";

const I18nContext = createContext<Translator | null>(null);

// Safe, static fallback for the rare trees Next.js renders outside our own
// root layout (e.g. its internal /_global-error diagnostic page). Falling
// back to Spanish here is strictly a defensive net — every real page in the
// app is wrapped by <I18nProvider> from the root layout.
const fallbackTranslator = createTranslator(DEFAULT_LOCALE);

/**
 * Client-side translation boundary. The active locale always originates
 * server-side (cookie read in the root layout) and flows down as a plain
 * prop — this component never reads cookies or localStorage itself, so the
 * very first client render already matches the server-rendered markup.
 */
export function I18nProvider({
  children,
  locale,
}: {
  children: ReactNode;
  locale: Locale;
}) {
  const translator = useMemo(() => createTranslator(locale), [locale]);

  return <I18nContext.Provider value={translator}>{children}</I18nContext.Provider>;
}

export function useTranslations(): Translator {
  return useContext(I18nContext) ?? fallbackTranslator;
}
