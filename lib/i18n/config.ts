export const SUPPORTED_LOCALES = ["es", "ca"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export const LOCALE_COOKIE_NAME = "cp_locale";

// ~1 year, matches the "persistencia aproximada de un año" requirement.
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const FUNCTIONAL_TIME_ZONE = "Europe/Madrid";

export const localeIntlTag: Record<Locale, string> = {
  ca: "ca-ES",
  es: "es-ES",
};

export const localeNativeName: Record<Locale, string> = {
  ca: "Català",
  es: "Español",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "es" || value === "ca";
}

export function normalizeLocale(value: string | null | undefined): Locale {
  return isLocale(value) ? value : DEFAULT_LOCALE;
}
