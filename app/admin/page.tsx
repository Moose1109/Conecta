import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Card, SectionHeader } from "@/components/ui/card";
import { getActivities } from "@/lib/api/activities.service";
import { getVillages } from "@/lib/api/villages.service";

const users = [
  { name: "Ana Morales", role: "Vecina", village: "Rupit" },
  { name: "Marta Soler", role: "Organizadora", village: "Rupit" },
  { name: "Joan Ferrer", role: "Moderador", village: "Besalú" },
  { name: "Laia Pujol", role: "Vecina", village: "Siurana" },
];

export default function AdminPage() {
  const activities = getActivities();
  const villages = getVillages();

  return (
    <>
      <Navbar />
      <main className="page-shell py-12">
        <SectionHeader
          eyebrow="Admin mock"
          title="Panel operativo"
          description="Vista visual sin acciones reales, lista para conectar permisos, CRUD y métricas desde backend."
        />
        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="Pueblos" value={String(villages.length)} />
          <Metric label="Actividades" value={String(activities.length)} />
          <Metric label="Usuarios" value={String(users.length)} />
          <Metric label="Inscripciones" value="128" />
        </div>

        <div className="mt-10 grid gap-6 xl:grid-cols-3">
          <AdminList
            title="Pueblos"
            rows={villages.map((village) => ({
              main: village.name,
              meta: `${village.province} · ${village.population} hab.`,
            }))}
          />
          <AdminList
            title="Actividades"
            rows={activities.map((activity) => ({
              main: activity.title,
              meta: `${activity.category} · ${activity.spots} plazas`,
            }))}
          />
          <AdminList
            title="Usuarios"
            rows={users.map((user) => ({
              main: user.name,
              meta: `${user.role} · ${user.village}`,
            }))}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm font-bold text-[#1E1E1E]/52">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#1F3D2B]">{value}</p>
    </Card>
  );
}

function AdminList({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ main: string; meta: string }>;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="border-b border-[#1F3D2B12] p-5">
        <h2 className="text-xl font-black text-[#1F3D2B]">{title}</h2>
      </div>
      <div className="divide-y divide-[#1F3D2B12]">
        {rows.map((row) => (
          <div key={`${title}-${row.main}`} className="p-5">
            <p className="font-black text-[#1F3D2B]">{row.main}</p>
            <p className="mt-1 text-sm text-[#1E1E1E]/58">{row.meta}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
