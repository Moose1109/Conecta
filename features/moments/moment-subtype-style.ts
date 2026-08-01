import {
  CalendarClock,
  History,
  Lightbulb,
  Megaphone,
  type LucideIcon,
  Images,
  Zap,
} from "lucide-react";
import type { MomentSubtype } from "@/features/moments/moments-concept-data";

export type MomentSubtypeStyle = {
  accent: string;
  badgeClassName: string;
  icon: LucideIcon;
  iconWrapClassName: string;
};

export const momentSubtypeStyles: Record<MomentSubtype, MomentSubtypeStyle> = {
  ahora: {
    accent: "#184B34",
    badgeClassName: "bg-[#184B3414] text-[#184B34]",
    icon: Zap,
    iconWrapClassName: "bg-[#184B3414] text-[#184B34]",
  },
  aviso: {
    accent: "#A95539",
    badgeClassName: "bg-[#C96D4A1f] text-[#A95539]",
    icon: Megaphone,
    iconWrapClassName: "bg-[#C96D4A1f] text-[#A95539]",
  },
  consejo: {
    accent: "#4B5D4E",
    badgeClassName: "bg-[#78947D26] text-[#3E4C40]",
    icon: Lightbulb,
    iconWrapClassName: "bg-[#78947D26] text-[#3E4C40]",
  },
  plan: {
    accent: "#9B7627",
    badgeClassName: "bg-[#D7A63C24] text-[#9B7627]",
    icon: CalendarClock,
    iconWrapClassName: "bg-[#D7A63C24] text-[#9B7627]",
  },
  postal: {
    accent: "#C96D4A",
    badgeClassName: "bg-[#C96D4A1f] text-[#C96D4A]",
    icon: Images,
    iconWrapClassName: "bg-[#C96D4A1f] text-[#C96D4A]",
  },
  recuerdo: {
    accent: "#9B7627",
    badgeClassName: "bg-[#D7A63C24] text-[#7A5C1E]",
    icon: History,
    iconWrapClassName: "bg-[#D7A63C24] text-[#7A5C1E]",
  },
};
