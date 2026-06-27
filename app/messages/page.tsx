import { FuturePage } from "@/components/ui/future-page";

export default function MessagesPage() {
  return (
    <FuturePage
      eyebrow="Mensajes"
      title="Conversaciones locales"
      description="Bandeja visual mock para futuros mensajes entre vecinos, organizadores y pueblos."
      items={["Organizadores", "Vecinos", "Grupos de actividad"]}
    />
  );
}
