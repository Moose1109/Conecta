import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/card";
import { getActivityCategories } from "@/lib/api/activities.service";
import { getVillages } from "@/lib/api/villages.service";

export default async function CreateActivityPage() {
  const activityCategories = getActivityCategories();
  const villages = await getVillages();

  return (
    <>
      <Navbar />
      <main className="page-shell max-w-4xl py-12">
        <SectionHeader
          eyebrow="Nueva actividad"
          title="Crea una propuesta para tu pueblo"
          description="Diseña una actividad local con la información que necesitará la comunidad para sumarse."
        />
        <Card className="p-6 md:p-8">
          <form className="grid gap-5">
            <div>
              <label className="label" htmlFor="title">
                Título
              </label>
              <input className="field" id="title" placeholder="Paseo botánico al atardecer" />
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label" htmlFor="village">
                  Pueblo
                </label>
                <select className="field" id="village" defaultValue="">
                  <option value="" disabled>
                    Selecciona un pueblo
                  </option>
                  {villages.map((village) => (
                    <option key={village.id} value={village.id}>
                      {village.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="category">
                  Categoría
                </label>
                <select className="field" id="category" defaultValue="">
                  <option value="" disabled>
                    Selecciona una categoría
                  </option>
                  {activityCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3">
              <div>
                <label className="label" htmlFor="date">
                  Fecha
                </label>
                <input className="field" id="date" type="date" />
              </div>
              <div>
                <label className="label" htmlFor="time">
                  Hora
                </label>
                <input className="field" id="time" type="time" />
              </div>
              <div>
                <label className="label" htmlFor="spots">
                  Plazas
                </label>
                <input className="field" id="spots" min="1" placeholder="24" type="number" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="description">
                Descripción
              </label>
              <textarea
                className="field min-h-36 resize-y"
                id="description"
                placeholder="Cuenta qué se hará, para quién es y qué debe traer la gente."
              />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button type="button">Guardar borrador</Button>
              <p className="text-sm text-[#1E1E1E]/58">
                En esta demo el formulario no publica todavía.
              </p>
            </div>
          </form>
        </Card>
      </main>
      <Footer />
    </>
  );
}
