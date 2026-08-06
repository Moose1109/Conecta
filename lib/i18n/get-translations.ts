import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator, type Translator } from "@/lib/i18n/translate";

/** Server Component helper: resolves the request locale and returns a bound translator. */
export async function getTranslations(): Promise<Translator> {
  const locale = await getLocale();
  return createTranslator(locale);
}
