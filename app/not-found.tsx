import { MapPinned, Signpost } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="page-shell grid min-h-[calc(100dvh-72px)] place-items-center py-12">
        <Card className="relative w-full max-w-2xl overflow-hidden p-8 text-center sm:p-12">
          <div aria-hidden="true" className="topographic-pattern absolute inset-0 opacity-20" />
          <div className="relative">
            <span className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[#D7A63C24] text-[#184B34]"><MapPinned aria-hidden="true" className="size-7" /></span>
            <p className="eyebrow mt-5">Error 404</p>
            <h1 className="mt-3 text-4xl font-extrabold leading-[1.05] tracking-[-0.045em] text-[#0E3325] sm:text-5xl">Este camino no llega al pueblo</h1>
            <p className="mx-auto mt-4 max-w-lg text-base leading-7 text-[#687269]">La página que buscas no existe o se ha movido. Puedes volver a la plaza o seguir explorando lugares.</p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <LinkButton href="/community"><Signpost aria-hidden="true" className="size-4" />Ir a comunidad</LinkButton>
              <LinkButton href="/villages" variant="secondary">Explorar pueblos</LinkButton>
            </div>
          </div>
        </Card>
      </main>
    </>
  );
}
