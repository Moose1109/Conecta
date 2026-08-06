import { FUNCTIONAL_TIME_ZONE, localeIntlTag, type Locale } from "@/lib/i18n/config";

function toDate(input: string | Date): Date {
  if (input instanceof Date) return input;
  // Date-only strings ("2026-07-31") are parsed at noon to avoid UTC
  // midnight rolling into the previous day for Europe/Madrid readers.
  return new Date(input.includes("T") ? input : `${input}T12:00:00`);
}

export function formatFullDate(input: string | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeIntlTag[locale], {
    day: "numeric",
    month: "long",
    timeZone: FUNCTIONAL_TIME_ZONE,
    year: "numeric",
  }).format(toDate(input));
}

export function formatDayNumber(input: string | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeIntlTag[locale], {
    day: "2-digit",
    timeZone: FUNCTIONAL_TIME_ZONE,
  }).format(toDate(input));
}

export function formatShortDate(input: string | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeIntlTag[locale], {
    day: "2-digit",
    month: "short",
    timeZone: FUNCTIONAL_TIME_ZONE,
  }).format(toDate(input));
}

export function formatWeekday(input: string | Date, locale: Locale): string {
  const value = new Intl.DateTimeFormat(localeIntlTag[locale], {
    timeZone: FUNCTIONAL_TIME_ZONE,
    weekday: "short",
  }).format(toDate(input));
  return value.replace(".", "").toUpperCase();
}

export function formatWeekdayLong(input: string | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeIntlTag[locale], {
    timeZone: FUNCTIONAL_TIME_ZONE,
    weekday: "long",
  }).format(toDate(input));
}

export function formatMonthLong(input: string | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeIntlTag[locale], {
    month: "long",
    timeZone: FUNCTIONAL_TIME_ZONE,
  }).format(toDate(input));
}

export function formatMonthShort(input: string | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeIntlTag[locale], {
    month: "short",
    timeZone: FUNCTIONAL_TIME_ZONE,
  })
    .format(toDate(input))
    .replace(".", "");
}

export function formatTime(input: string | Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeIntlTag[locale], {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: FUNCTIONAL_TIME_ZONE,
  }).format(toDate(input));
}

export function formatNumber(value: number, locale: Locale): string {
  return new Intl.NumberFormat(localeIntlTag[locale]).format(value);
}

const RELATIVE_DIVISIONS: Array<{ amount: number; unit: Intl.RelativeTimeFormatUnit }> = [
  { amount: 60, unit: "seconds" },
  { amount: 60, unit: "minutes" },
  { amount: 24, unit: "hours" },
  { amount: 7, unit: "days" },
  { amount: 4.34524, unit: "weeks" },
  { amount: 12, unit: "months" },
  { amount: Number.POSITIVE_INFINITY, unit: "years" },
];

/** "hace 2 horas" / "fa 2 hores" style relative phrasing, backed by Intl. */
export function formatRelativeTime(
  input: string | Date,
  locale: Locale,
  now: Date = new Date(),
): string {
  const date = toDate(input);
  const rtf = new Intl.RelativeTimeFormat(localeIntlTag[locale], { numeric: "auto" });

  let duration = (date.getTime() - now.getTime()) / 1000;

  for (const division of RELATIVE_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return rtf.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }

  return rtf.format(Math.round(duration), "years");
}
