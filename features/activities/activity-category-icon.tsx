import type { LucideIcon } from "lucide-react";
import {
  Bike,
  CircleHelp,
  HandHeart,
  Landmark,
  Music2,
  PartyPopper,
  ShoppingBasket,
  TreePine,
  Utensils,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActivityCategory } from "@/lib/types";
import type { TranslationKey } from "@/lib/i18n/types";

type CategoryPresentation = {
  icon: LucideIcon;
  labelKey: TranslationKey;
  pill: string;
};

// `ActivityCategory` values are the backend-facing identifiers (used in
// query params and form submissions) and must stay in Spanish; only the
// label shown to people is localized, via `labelKey`.
const categoryPresentation: Record<ActivityCategory, CategoryPresentation> = {
  Naturaleza: {
    icon: TreePine,
    labelKey: "activities.categories.naturaleza",
    pill: "border-[#78947D38] bg-[#78947D1f] text-[#355D42]",
  },
  Cultura: {
    icon: Landmark,
    labelKey: "activities.categories.cultura",
    pill: "border-[#60818A38] bg-[#60818A1f] text-[#355E68]",
  },
  Gastronomía: {
    icon: Utensils,
    labelKey: "activities.categories.gastronomia",
    pill: "border-[#D7A63C42] bg-[#D7A63C24] text-[#6D5215]",
  },
  Deporte: {
    icon: Bike,
    labelKey: "activities.categories.deporte",
    pill: "border-[#347A4838] bg-[#347A481c] text-[#245B36]",
  },
  Música: {
    icon: Music2,
    labelKey: "activities.categories.musica",
    pill: "border-[#C96D4A38] bg-[#C96D4A1b] text-[#87442F]",
  },
  Voluntariado: {
    icon: HandHeart,
    labelKey: "activities.categories.voluntariado",
    pill: "border-[#78947D42] bg-[#78947D20] text-[#42614A]",
  },
  Mercados: {
    icon: ShoppingBasket,
    labelKey: "activities.categories.mercados",
    pill: "border-[#D7A63C42] bg-[#D7A63C24] text-[#6D5215]",
  },
  "Fiestas locales": {
    icon: PartyPopper,
    labelKey: "activities.categories.fiestasLocales",
    pill: "border-[#C96D4A3d] bg-[#C96D4A1c] text-[#87442F]",
  },
  Otra: {
    icon: CircleHelp,
    labelKey: "activities.categories.otra",
    pill: "border-[#60818A38] bg-[#60818A16] text-[#435F65]",
  },
};

export function ActivityCategoryIcon({
  category,
  className,
}: {
  category: ActivityCategory;
  className?: string;
}) {
  const Icon = categoryPresentation[category].icon;

  return <Icon aria-hidden="true" className={className} />;
}

export function activityCategoryPill(category: ActivityCategory) {
  return cn("border", categoryPresentation[category].pill);
}

/** Translation key for the localized display label of a category identifier. */
export function activityCategoryLabelKey(category: ActivityCategory): TranslationKey {
  return categoryPresentation[category].labelKey;
}
