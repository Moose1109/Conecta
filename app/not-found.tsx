import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="page-shell grid min-h-[calc(100vh-16rem)] place-items-center py-16">
        <Card className="max-w-2xl p-8 text-center">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#3A7D44]">
            404
          </p>
          <h1 className="mt-3 text-4xl font-black text-[#1F3D2B] md:text-5xl">
            Este camino no llega al pueblo
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#1E1E1E]/68">
            La página que buscas no existe o se ha movido. Puedes volver al inicio
            social y seguir explorando actividades, publicaciones y pueblos.
          </p>
          <div className="mt-7">
            <LinkButton href="/dashboard">Volver al inicio</LinkButton>
          </div>
        </Card>
      </main>
      <Footer />
    </>
  );
}
