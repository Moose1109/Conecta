import { FuturePage } from "@/components/ui/future-page";

export default function SettingsPage() {
  return (
    <FuturePage
      eyebrow="Ajustes"
      title="Preferencias de la cuenta"
      description="Pantalla mock para futuras preferencias de perfil, privacidad, notificaciones e intereses."
      items={["Perfil", "Privacidad", "Notificaciones"]}
    />
  );
}
