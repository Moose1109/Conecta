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

type CategoryPresentation = {
  icon: LucideIcon;
  pill: string;
};

const categoryPresentation: Record<ActivityCategory, CategoryPresentation> = {
  Naturaleza: {
    icon: TreePine,
    pill: "border-[#78947D38] bg-[#78947D1f] text-[#355D42]",
  },
  Cultura: {
    icon: Landmark,
    pill: "border-[#60818A38] bg-[#60818A1f] text-[#355E68]",
  },
  Gastronomía: {
    icon: Utensils,
    pill: "border-[#D7A63C42] bg-[#D7A63C24] text-[#6D5215]",
  },
  Deporte: {
    icon: Bike,
    pill: "border-[#347A4838] bg-[#347A481c] text-[#245B36]",
  },
  Música: {
    icon: Music2,
    pill: "border-[#C96D4A38] bg-[#C96D4A1b] text-[#87442F]",
  },
  Voluntariado: {
    icon: HandHeart,
    pill: "border-[#78947D42] bg-[#78947D20] text-[#42614A]",
  },
  Mercados: {
    icon: ShoppingBasket,
    pill: "border-[#D7A63C42] bg-[#D7A63C24] text-[#6D5215]",
  },
  "Fiestas locales": {
    icon: PartyPopper,
    pill: "border-[#C96D4A3d] bg-[#C96D4A1c] text-[#87442F]",
  },
  Otra: {
    icon: CircleHelp,
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
