import Image from "next/image";
import { cn } from "@/lib/utils";

export function UserAvatar({
  name,
  initials,
  imageUrl,
  className,
}: {
  name: string;
  initials?: string;
  imageUrl?: string;
  className?: string;
}) {
  const safeInitials =
    initials && !initials.startsWith("http://") && !initials.startsWith("https://")
      ? initials
      : undefined;
  const fallback =
    safeInitials ??
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
        "relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full bg-[#D9A441] text-sm font-black text-[#1F3D2B] ring-4 ring-white",
        className,
      )}
      title={name}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
          sizes="44px"
        />
      ) : (
        fallback
      )}
    </div>
  );
}
