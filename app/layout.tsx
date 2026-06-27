import type { Metadata } from "next";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ConectaPueblos",
    template: "%s | ConectaPueblos",
  },
  description:
    "Red social rural para descubrir pueblos, actividades locales y comunidad.",
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
      <body className="min-h-full flex flex-col pb-20 md:pb-0">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
