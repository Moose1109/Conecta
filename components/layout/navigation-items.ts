import {
  Bell,
  Bookmark,
  CalendarDays,
  Compass,
  Home,
  MapPin,
  MessageCircle,
  Settings,
  UserRound,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  meta: string;
  mobileLabel?: string;
};

export const primaryNavigationItems = [
  {
    href: "/community",
    icon: Home,
    label: "Comunidad",
    meta: "Tu plaza digital",
  },
  {
    href: "/activities",
    icon: CalendarDays,
    label: "Actividades",
    meta: "Planes cerca de ti",
    mobileLabel: "Planes",
  },
  {
    href: "/villages",
    icon: MapPin,
    label: "Pueblos",
    meta: "Lugares con vida propia",
  },
] satisfies NavigationItem[];

export const profileNavigationItem = {
  href: "/profile",
  icon: UserRound,
  label: "Mi perfil",
  meta: "Tu actividad social",
  mobileLabel: "Perfil",
} satisfies NavigationItem;

export const secondaryNavigationItems = [
  profileNavigationItem,
  {
    href: "/explore",
    icon: Compass,
    label: "Explorar",
    meta: "Descubre contenido local",
  },
  {
    href: "/saved",
    icon: Bookmark,
    label: "Guardados",
    meta: "Publicaciones y planes",
  },
  {
    href: "/messages",
    icon: MessageCircle,
    label: "Mensajes",
    meta: "Conversaciones locales",
  },
  {
    href: "/notifications",
    icon: Bell,
    label: "Notificaciones",
    meta: "Novedades de tu cuenta",
  },
  {
    href: "/settings",
    icon: Settings,
    label: "Ajustes",
    meta: "Perfil y preferencias",
  },
] satisfies NavigationItem[];

export const communityInviteItem = {
  href: "/community#publicar",
  icon: UsersRound,
  label: "Invita a tus vecinos",
  meta: "Haz crecer la comunidad",
} satisfies NavigationItem;
