import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  initials,
  className,
}: {
  name: string;
  initials?: string;
  className?: string;
}) {
  const fallback =
    initials ??
    name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  return (
    <div
      aria-label={name}
      className={cn(
        "grid size-11 shrink-0 place-items-center rounded-full bg-[#D9A441] text-sm font-black text-[#1F3D2B] ring-4 ring-white",
        className,
      )}
      title={name}
    >
      {fallback}
    </div>
  );
}
