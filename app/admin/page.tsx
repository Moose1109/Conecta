import { connection } from "next/server";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Card, SectionHeader } from "@/components/ui/card";
import { AuthGate } from "@/features/auth/auth-gate";
import { getActivities } from "@/lib/api/activities.service";
import { getVillages } from "@/lib/api/villages.service";

export default async function AdminPage() {
  await connection();

  const [activities, villages] = await Promise.all([getActivities(), getVillages()]);

  return (
    <>
      <Navbar />
      <main className="page-shell py-12">
        <AuthGate adminOnly message="Para acceder al panel admin necesitas iniciar sesión.">
          <SectionHeader
            eyebrow="Admin"
            title="Panel operativo"
            description="Vista de administración protegida para usuarios admin o superadmin."
          />
          <div className="grid gap-4 md:grid-cols-4">
            <Metric label="Pueblos" value={String(villages.length)} />
            <Metric label="Actividades" value={String(activities.length)} />
            <Metric label="Usuarios" value="Pendiente" />
            <Metric label="Inscripciones" value="Pendiente" />
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
            <Card className="p-5">
              <h2 className="text-xl font-black text-[#1F3D2B]">Usuarios</h2>
              <p className="mt-3 text-sm leading-6 text-[#1E1E1E]/68">
                Pendiente de endpoint backend real para listar usuarios desde el panel.
              </p>
            </Card>
          </div>
        </AuthGate>
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
