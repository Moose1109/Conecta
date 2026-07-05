import { FuturePage } from "@/components/ui/future-page";

export default function SettingsPage() {
  return (
    <FuturePage
      authMessage="Para acceder a tus ajustes necesitas iniciar sesión."
      eyebrow="Ajustes"
      title="Preferencias de la cuenta"
      description="Espacio preparado para preferencias de perfil, privacidad, notificaciones e intereses."
      items={["Perfil", "Privacidad", "Notificaciones"]}
    />
  );
}
