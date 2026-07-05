import { FuturePage } from "@/components/ui/future-page";

export default function MessagesPage() {
  return (
    <FuturePage
      authMessage="Para ver tus mensajes necesitas iniciar sesión."
      eyebrow="Mensajes"
      title="Conversaciones locales"
      description="Bandeja visual para futuras conversaciones entre vecinos, organizadores y pueblos."
      items={["Organizadores", "Vecinos", "Grupos de actividad"]}
    />
  );
}
