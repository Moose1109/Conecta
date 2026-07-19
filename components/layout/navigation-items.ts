import type { AuthIconName } from "@/features/auth/auth-icons";

export type NavigationItem = {
  href: string;
  icon: AuthIconName;
  label: string;
  meta: string;
  mobileLabel?: string;
  shortIcon: string;
};

export const primaryNavigationItems = [
  {
    href: "/community",
    icon: "users",
    label: "Comunidad",
    meta: "Feed, avisos y conversaciones",
    shortIcon: "Co",
  },
  {
    href: "/activities",
    icon: "calendar",
    label: "Actividades",
    meta: "Planes disponibles",
    mobileLabel: "Planes",
    shortIcon: "Pl",
  },
  {
    href: "/villages",
    icon: "map-pin",
    label: "Pueblos",
    meta: "Descubrir y seguir",
    shortIcon: "Pu",
  },
] satisfies NavigationItem[];

export const profileNavigationItem = {
  href: "/profile",
  icon: "user",
  label: "Mi perfil",
  meta: "Tu actividad social",
  mobileLabel: "Perfil",
  shortIcon: "Yo",
} satisfies NavigationItem;
