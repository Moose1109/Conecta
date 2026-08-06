/* eslint-disable @next/next/no-page-custom-font -- Root App Router layout owns the single document head. */
import type { Metadata } from "next";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { I18nProvider } from "@/components/i18n/i18n-provider";
import { getLocale } from "@/lib/i18n/get-locale";
import { getTranslations } from "@/lib/i18n/get-translations";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const { locale, t } = await getTranslations();

  return {
    title: {
      default: t("metadata.titleDefault"),
      template: t("metadata.titleTemplate"),
    },
    description: t("metadata.description"),
    keywords: t("metadata.keywords").split(",").map((keyword) => keyword.trim()),
    openGraph: {
      title: t("metadata.titleDefault"),
      description: t("metadata.ogDescription"),
      type: "website",
      locale: locale === "ca" ? "ca_ES" : "es_ES",
      siteName: "ConectaPueblos",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html lang={locale} className="h-full antialiased">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@100..900&family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        <I18nProvider locale={locale}>
          {children}
          <MobileBottomNav />
        </I18nProvider>
      </body>
    </html>
  );
}
