import type { Metadata } from "next";
import { AuthenticatedShell } from "@/components/layout/authenticated-shell";
import { BackendPendingAlert } from "@/components/ui/backend-pending-alert";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = { title: "Explorar" };

export default function ExplorePage() {
  return (
    <AuthenticatedShell>
      <PageHeader eyebrow="Exploración" title="Descubre contenido local" description="Una futura vista transversal para encontrar historias, planes y lugares." />
      <BackendPendingAlert actionHref="/villages" actionLabel="Explorar pueblos" description="Esta sección necesita un endpoint de recomendaciones o búsqueda global. Mientras llega, puedes explorar los listados reales de pueblos y actividades." />
    </AuthenticatedShell>
  );
}
