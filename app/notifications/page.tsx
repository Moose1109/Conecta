import Link from "next/link";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { AuthGate } from "@/features/auth/auth-gate";

export default function NotificationsPage() {
  return (
    <AuthenticatedShell>
      <AuthGate message="Para ver tus notificaciones necesitas iniciar sesión.">
        <PageHeader
          eyebrow="Centro social"
          title="Notificaciones"
          description="Novedades de publicaciones, actividades y pueblos seguidos en un solo espacio."
        />

        <Card className="overflow-hidden">
          <div className="border-b border-[#1F3D2B12] p-4 sm:p-5">
            <div
              aria-label="Filtros de notificaciones"
              className="grid max-w-md grid-cols-2 gap-2 rounded-2xl bg-[#EEF1ED] p-1"
              role="tablist"
            >
              <button
                aria-selected="true"
                className="min-h-11 rounded-xl bg-white text-sm font-black text-[#1F3D2B] shadow-sm"
                role="tab"
                type="button"
              >
                Todas
              </button>
              <button
                aria-selected="false"
                className="min-h-11 rounded-xl text-sm font-black text-[#1F3D2B]/58 transition-colors hover:text-[#1F3D2B]"
                role="tab"
                type="button"
              >
                No leídas
              </button>
            </div>
          </div>

          <div className="p-5 sm:p-8">
            {/* TODO backend: conectar GET /api/v1/notifications cuando exista un endpoint real activo. */}
            <div className="grid min-h-[360px] place-items-center rounded-3xl border border-dashed border-[#1F3D2B1f] bg-[#FAF7F0]/72 px-5 py-10 text-center">
              <div>
                <span className="mx-auto grid size-16 place-items-center rounded-3xl bg-[#D9A44124] text-[#3A7D44]">
                  <BellIcon className="size-7" />
                </span>
                <h2 className="mt-5 text-2xl font-black text-[#1F3D2B]">
                  Aún no tienes notificaciones
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#1E1E1E]/62">
                  Cuando alguien comente, se apunte a una actividad o haya
                  novedades en los pueblos que sigues, aparecerá aquí.
                </p>
                <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/community"
                    className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#3A7D44] px-5 py-2.5 text-sm font-black text-white transition-colors hover:bg-[#2f6738]"
                  >
                    Ir a comunidad
                  </Link>
                  <Link
                    href="/activities"
                    className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#1F3D2B18] bg-white/88 px-5 py-2.5 text-sm font-black text-[#1F3D2B] transition-colors hover:bg-white"
                  >
                    Explorar actividades
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </AuthGate>
    </AuthenticatedShell>
  );
}

function BellIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
      <path d="M10 21h4" />
    </svg>
  );
}
