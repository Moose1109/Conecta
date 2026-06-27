import type { ActivityCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryPill({
  category,
  active,
  onClick,
}: {
  category: ActivityCategory | "Todas";
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      className={cn(
        "min-h-10 rounded-full border px-4 text-sm font-extrabold transition-colors",
        active
          ? "border-[#3A7D44] bg-[#3A7D44] text-white"
          : "border-[#1F3D2B18] bg-white/80 text-[#1F3D2B] hover:bg-white",
      )}
      type="button"
      onClick={onClick}
    >
      {category}
    </button>
  );
}
