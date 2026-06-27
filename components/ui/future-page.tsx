import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingState } from "@/components/ui/loading-state";
import { PageHeader } from "@/components/ui/page-header";

export function FuturePage({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <>
      <Navbar />
      <main className="page-shell py-8 md:py-10">
        <PageHeader eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <Card key={item} className="p-5">
              <p className="text-lg font-black text-[#1F3D2B]">{item}</p>
              <p className="mt-2 text-sm leading-6 text-[#1E1E1E]/62">
                Vista preparada para crecer con datos reales en una fase futura.
              </p>
            </Card>
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <LoadingState label="Estado de carga de demostración" />
          <ErrorState
            title="Estado vacío preparado"
            description="Cuando conectemos backend, aquí aparecerán estados reales de carga, error o datos vacíos."
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
