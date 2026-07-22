/* eslint-disable @next/next/no-page-custom-font -- Root App Router layout owns the single document head. */
import type { Metadata } from "next";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ConectaPueblos",
    template: "%s | ConectaPueblos",
  },
  description:
    "Red social comunitaria para descubrir pueblos, actividades locales y publicaciones vecinales.",
  keywords: [
    "ConectaPueblos",
    "pueblos",
    "red social rural",
    "actividades locales",
    "comunidad",
    "eventos",
    "vida rural",
  ],
  openGraph: {
    title: "ConectaPueblos",
    description:
      "Descubre pueblos, participa en actividades locales y comparte comunidad.",
    type: "website",
    locale: "es_ES",
    siteName: "ConectaPueblos",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@100..900&family=Manrope:wght@200..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="flex min-h-full flex-col">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
