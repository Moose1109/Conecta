import { DEFAULT_LOCALE, localeIntlTag, type Locale } from "@/lib/i18n/config";
import { ca } from "@/lib/i18n/dictionaries/ca";
import { es } from "@/lib/i18n/dictionaries/es";
import type {
  Dictionary,
  PluralForms,
  PluralTranslationKey,
  TranslationKey,
  TranslationVars,
} from "@/lib/i18n/types";

const dictionaries: Record<Locale, Dictionary> = { ca, es };

function resolvePath(dict: Dictionary, path: string): unknown {
  return path.split(".").reduce<unknown>((node, segment) => {
    if (node && typeof node === "object" && segment in node) {
      return (node as Record<string, unknown>)[segment];
    }
    return undefined;
  }, dict);
}

function interpolate(template: string, vars?: TranslationVars): string {
  if (!vars) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key: string) => {
    const value = vars[key];
    return value === undefined ? match : String(value);
  });
}

function warnMissing(kind: "key" | "plural", path: string) {
  if (process.env.NODE_ENV === "production") return;
  console.warn(`[i18n] Missing translation ${kind}: "${path}"`);
}

export type Translator = {
  locale: Locale;
  dict: Dictionary;
  t: (key: TranslationKey | (string & {}), vars?: TranslationVars) => string;
  tPlural: (key: PluralTranslationKey | (string & {}), count: number, vars?: TranslationVars) => string;
};

export function createTranslator(locale: Locale): Translator {
  const dict = dictionaries[locale];
  const fallbackDict = dictionaries[DEFAULT_LOCALE];

  function t(key: string, vars?: TranslationVars): string {
    const value = resolvePath(dict, key);
    if (typeof value === "string") return interpolate(value, vars);

    const fallbackValue = resolvePath(fallbackDict, key);
    if (typeof fallbackValue === "string") {
      warnMissing("key", key);
      return interpolate(fallbackValue, vars);
    }

    warnMissing("key", key);
    return "";
  }

  function tPlural(key: string, count: number, vars?: TranslationVars): string {
    const raw = (resolvePath(dict, key) ?? resolvePath(fallbackDict, key)) as
      | PluralForms
      | undefined;

    if (!raw || typeof raw.other !== "string") {
      warnMissing("plural", key);
      return "";
    }

    const category = new Intl.PluralRules(localeIntlTag[locale]).select(count);
    const template = (category === "one" ? raw.one : undefined) ?? raw.other;
    return interpolate(template, { count, ...vars });
  }

  return { dict, locale, t, tPlural };
}
