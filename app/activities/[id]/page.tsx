import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Badge, Card } from "@/components/ui/card";
import { getActivities, getActivityById } from "@/lib/api/activities.service";
import { getVillageById } from "@/lib/api/villages.service";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return getActivities().map((activity) => ({ id: activity.id }));
}

export default async function ActivityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const activity = getActivityById(id);

  if (!activity) {
    notFound();
  }

  const village = getVillageById(activity.villageId);

  return (
    <>
      <Navbar />
      <main className="page-shell grid gap-8 py-12 lg:grid-cols-[1fr_360px]">
        <article>
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl">
            <Image
              src={activity.image}
              alt={activity.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 760px"
              priority
            />
          </div>
          <div className="mt-8">
            <Badge>{activity.category}</Badge>
            <h1 className="mt-4 text-4xl font-black text-[#1F3D2B] md:text-6xl">
              {activity.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#1E1E1E]/72">
              {activity.description}
            </p>
          </div>
        </article>
        <aside>
          <Card className="sticky top-24 p-6">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#3A7D44]">
              Detalles
            </p>
            <div className="mt-5 grid gap-4 text-sm">
              <Info label="Fecha" value={formatDate(activity.date)} />
              <Info label="Hora" value={activity.time} />
              <Info
                label="Pueblo"
                value={village ? village.name : "Pueblo no encontrado"}
                href={village ? `/villages/${village.id}` : undefined}
              />
              <Info label="Plazas" value={`${activity.spots} disponibles`} />
              <Info label="Organiza" value={activity.organizer} />
            </div>
            <Button className="mt-7 w-full" type="button">
              Apuntarme
            </Button>
            <p className="mt-3 text-center text-xs text-[#1E1E1E]/52">
              Acción mock, sin inscripción real todavía.
            </p>
          </Card>
        </aside>
      </main>
      <Footer />
    </>
  );
}

function Info({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div className="rounded-2xl bg-[#F3F4F6] p-4">
      <p className="font-bold text-[#1E1E1E]/52">{label}</p>
      {href ? (
        <Link href={href} className="mt-1 block font-black text-[#1F3D2B]">
          {value}
        </Link>
      ) : (
        <p className="mt-1 font-black text-[#1F3D2B]">{value}</p>
      )}
    </div>
  );
}
