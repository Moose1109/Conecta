import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { formatFullDate, formatNumber } from "@/lib/i18n/formatters";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(date: string, locale: Locale = DEFAULT_LOCALE) {
  return formatFullDate(date, locale);
}

export function formatPopulation(population: number, locale: Locale = DEFAULT_LOCALE) {
  return formatNumber(population, locale);
}
