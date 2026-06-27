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
    <html
      lang="es"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col pb-24 md:pb-0">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
