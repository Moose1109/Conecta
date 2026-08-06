import type { es } from "@/lib/i18n/dictionaries/es";

/**
 * Cardinal plural shape. Spanish and Catalan only ever need the CLDR "one"
 * and "other" categories for cardinal numbers, so that is all we model.
 */
export type PluralForms = {
  one: string;
  other: string;
};

/** Spanish is the base contract; the Catalan dictionary is typed against it. */
export type Dictionary = typeof es;

type IsPlainString<T> = T extends string ? true : false;
type IsPluralForms<T> = T extends PluralForms ? true : false;

/**
 * Recursively derives every dot-path that resolves to a plain translatable
 * string (namespaces and plural-form leaves are excluded on purpose).
 */
export type StringPaths<T, Prefix extends string = ""> = {
  [K in Extract<keyof T, string>]: IsPlainString<T[K]> extends true
    ? `${Prefix}${K}`
    : IsPluralForms<T[K]> extends true
      ? never
      : T[K] extends Record<string, unknown>
        ? StringPaths<T[K], `${Prefix}${K}.`>
        : never;
}[Extract<keyof T, string>];

/** Recursively derives every dot-path that resolves to a plural-form leaf. */
export type PluralPaths<T, Prefix extends string = ""> = {
  [K in Extract<keyof T, string>]: IsPluralForms<T[K]> extends true
    ? `${Prefix}${K}`
    : IsPlainString<T[K]> extends true
      ? never
      : T[K] extends Record<string, unknown>
        ? PluralPaths<T[K], `${Prefix}${K}.`>
        : never;
}[Extract<keyof T, string>];

export type TranslationKey = StringPaths<Dictionary>;
export type PluralTranslationKey = PluralPaths<Dictionary>;

export type TranslationVars = Record<string, string | number>;
