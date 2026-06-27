import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { LinkButton } from "@/components/ui/button";
import { Card, SectionHeader } from "@/components/ui/card";
import { getActivities } from "@/lib/api/activities.service";
import { getVillages } from "@/lib/api/villages.service";
import { ActivityCard } from "@/features/activities/activity-card";
import { VillageCard } from "@/features/villages/village-card";

const benefits = [
  {
    title: "Planes con raíz local",
    text: "Encuentra rutas, talleres, mercados y fiestas creadas por personas del territorio.",
  },
  {
    title: "Comunidad activa",
    text: "Publicaciones vecinales, propuestas compartidas y espacios para colaborar.",
  },
  {
    title: "Pueblos visibles",
    text: "Cada pueblo tiene su ficha, actividades relacionadas y una narrativa propia.",
  },
];

const howItWorks = [
  {
    title: "Descubre",
    text: "Explora pueblos, actividades y publicaciones locales desde un feed social pensado para moverse fácil.",
  },
  {
    title: "Participa",
    text: "Apúntate a planes, guarda eventos, sigue pueblos y encuentra personas con intereses cercanos.",
  },
  {
    title: "Comparte",
    text: "Publica avisos, fotos, propuestas y necesidades comunitarias para activar la vida del pueblo.",
  },
];

export default function Home() {
  const activities = getActivities();
  const villages = getVillages();

  return (
    <>
      <Navbar />
      <main>
        <section className="rural-grid">
          <div className="page-shell grid min-h-[calc(100vh-4rem)] items-center gap-10 py-12 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mb-4 inline-flex rounded-full bg-white/80 px-4 py-2 text-sm font-extrabold text-[#3A7D44] shadow-sm">
                Red social rural, actividad local y comunidad
              </p>
              <h1 className="max-w-3xl text-5xl font-black leading-[1.02] text-[#1F3D2B] md:text-7xl">
                La red social para pueblos que siguen latiendo.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-[#1E1E1E]/72">
                ConectaPueblos reúne actividades, publicaciones, perfiles y pueblos
                en una experiencia social cálida para descubrir, participar y compartir
                vida local.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <LinkButton href="/activities">Explorar actividades</LinkButton>
                <LinkButton href="/villages" variant="secondary">
                  Ver pueblos
                </LinkButton>
                <LinkButton href="/community" variant="ghost">
                  Entrar al feed
                </LinkButton>
              </div>
            </div>
            <Card className="overflow-hidden p-3">
              <div className="rounded-xl bg-[#1F3D2B] p-5 text-white">
                <p className="text-sm font-bold text-[#D9A441]">Próxima actividad</p>
                <h2 className="mt-3 text-3xl font-black">{activities[0].title}</h2>
                <p className="mt-3 text-white/72">{activities[0].description}</p>
                <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl bg-white/10 p-3">
                    <p className="text-2xl font-black">5</p>
                    <p className="text-xs text-white/64">pueblos</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3">
                    <p className="text-2xl font-black">8</p>
                    <p className="text-xs text-white/64">categorías</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3">
                    <p className="text-2xl font-black">120+</p>
                    <p className="text-xs text-white/64">plazas</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section className="page-shell py-16">
          <SectionHeader
            eyebrow="Cómo funciona"
            title="De mirar a participar en tres pasos"
            description="Una experiencia social para pasar del descubrimiento a la acción comunitaria."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {howItWorks.map((item, index) => (
              <Card key={item.title} className="p-6">
                <span className="grid size-10 place-items-center rounded-2xl bg-[#D9A441] text-sm font-black text-[#1F3D2B]">
                  {index + 1}
                </span>
                <h3 className="mt-4 text-xl font-black text-[#1F3D2B]">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/70">{item.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="page-shell py-16">
          <SectionHeader
            eyebrow="Agenda"
            title="Descubre actividades cerca de ti"
            description="Planes próximos para entrar en contacto con cada territorio desde la experiencia."
          />
          <div className="grid gap-6 md:grid-cols-3">
            {activities.slice(0, 3).map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </section>

        <section className="bg-[#F3F4F6] py-16">
          <div className="page-shell">
            <SectionHeader
              eyebrow="Mapa vivo"
              title="Conecta con tu pueblo"
              description="Lugares pequeños con patrimonio, naturaleza y personas organizando cosas bonitas."
            />
            <div className="grid gap-6 md:grid-cols-3">
              {villages.slice(0, 3).map((village) => (
                <VillageCard key={village.id} village={village} />
              ))}
            </div>
          </div>
        </section>

        <section className="page-shell py-16">
          <SectionHeader
            title="Publica, participa y comparte"
            description="El feed comunitario convierte avisos, fotos, rutas y propuestas en conversación local."
          />
          <div className="grid gap-5 md:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="p-6">
                <h3 className="text-xl font-black text-[#1F3D2B]">{benefit.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/70">{benefit.text}</p>
              </Card>
            ))}
          </div>
        </section>

        <section className="page-shell">
          <div className="rounded-3xl bg-[#3A7D44] px-6 py-12 text-center text-white md:px-12">
            <h2 className="text-3xl font-black md:text-5xl">
              Empieza por una actividad. Quédate por la comunidad.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-white/76">
              ConectaPueblos está listo para crecer con más pueblos, perfiles,
              inscripciones reales y administración conectada a FastAPI.
            </p>
            <div className="mt-7">
              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <LinkButton href="/activities" variant="secondary">
                  Ver actividades
                </LinkButton>
                <LinkButton href="/villages" variant="secondary">
                  Explorar pueblos
                </LinkButton>
                <LinkButton href="/community" variant="secondary">
                  Abrir comunidad
                </LinkButton>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
