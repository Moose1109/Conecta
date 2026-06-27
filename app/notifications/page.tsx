import { FuturePage } from "@/components/ui/future-page";

export default function NotificationsPage() {
  return (
    <FuturePage
      eyebrow="Notificaciones"
      title="Lo nuevo en tu comunidad"
      description="Avisos mock para futuras interacciones, inscripciones, comentarios y pueblos seguidos."
      items={["Nuevos comentarios", "Actividades guardadas", "Pueblos que sigues"]}
    />
  );
}
