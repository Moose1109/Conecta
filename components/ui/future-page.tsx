import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
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
      <main className="page-shell py-10">
        <PageHeader eyebrow={eyebrow} title={title} description={description} />
        <div className="grid gap-4 md:grid-cols-3">
          {items.map((item) => (
            <Card key={item} className="p-5">
              <p className="text-lg font-black text-[#1F3D2B]">{item}</p>
              <p className="mt-2 text-sm leading-6 text-[#1E1E1E]/62">
                Vista mock preparada para conectarse a datos reales en una fase futura.
              </p>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
