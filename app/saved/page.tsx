import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import { AuthGate } from "@/features/auth/auth-gate";

export const metadata: Metadata = { title: "Guardados" };

export default function SavedPage() {
  return (
    <AuthenticatedShell>
      <AuthGate message="Para ver tus guardados necesitas iniciar sesión.">
        <PageHeader eyebrow="Mi espacio" title="Guardados" description="Publicaciones y actividades que quieres volver a encontrar." />
        <BackendPendingAlert actionHref="/community" actionLabel="Ir a comunidad" description="Las acciones de guardar ya usan endpoints reales, pero el backend todavía no ofrece una colección para recuperar todos tus guardados." />
        <Card className="mt-5 grid min-h-72 place-items-center border-dashed p-7 text-center shadow-none">
          <div><span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#D7A63C24] text-[#184B34]"><Bookmark aria-hidden="true" className="size-6" /></span><h2 className="mt-4 text-xl font-extrabold text-[#18231D]">Tu colección aparecerá aquí</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#687269]">No mostramos elementos simulados mientras no sea posible consultarlos desde tu cuenta.</p><Link className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#184B34] px-5 text-sm font-extrabold text-white hover:bg-[#0E3325]" href="/community">Ir a comunidad</Link></div>
        </Card>
      </AuthGate>
    </AuthenticatedShell>
  );
}
