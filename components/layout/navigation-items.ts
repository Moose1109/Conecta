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
import type { TranslationKey } from "@/lib/i18n/types";

export type NavigationItem = {
  href: string;
  icon: LucideIcon;
  labelKey: TranslationKey;
  metaKey: TranslationKey;
  mobileLabelKey?: TranslationKey;
};

export const primaryNavigationItems = [
  {
    href: "/community",
    icon: Home,
    labelKey: "navigation.community.label",
    metaKey: "navigation.community.meta",
  },
  {
    href: "/activities",
    icon: CalendarDays,
    labelKey: "navigation.activities.label",
    metaKey: "navigation.activities.meta",
    mobileLabelKey: "navigation.activities.mobileLabel",
  },
  {
    href: "/villages",
    icon: MapPin,
    labelKey: "navigation.villages.label",
    metaKey: "navigation.villages.meta",
  },
] satisfies NavigationItem[];

export const profileNavigationItem = {
  href: "/profile",
  icon: UserRound,
  labelKey: "navigation.profile.label",
  metaKey: "navigation.profile.meta",
  mobileLabelKey: "navigation.profile.mobileLabel",
} satisfies NavigationItem;

export const secondaryNavigationItems = [
  profileNavigationItem,
  {
    href: "/explore",
    icon: Compass,
    labelKey: "navigation.explore.label",
    metaKey: "navigation.explore.meta",
  },
  {
    href: "/saved",
    icon: Bookmark,
    labelKey: "navigation.saved.label",
    metaKey: "navigation.saved.meta",
  },
  {
    href: "/messages",
    icon: MessageCircle,
    labelKey: "navigation.messages.label",
    metaKey: "navigation.messages.meta",
  },
  {
    href: "/notifications",
    icon: Bell,
    labelKey: "navigation.notifications.label",
    metaKey: "navigation.notifications.meta",
  },
  {
    href: "/settings",
    icon: Settings,
    labelKey: "navigation.settings.label",
    metaKey: "navigation.settings.meta",
  },
] satisfies NavigationItem[];

export const communityInviteItem = {
  href: "/community#publicar",
  icon: UsersRound,
  labelKey: "navigation.communityInvite.label",
  metaKey: "navigation.communityInvite.meta",
} satisfies NavigationItem;
