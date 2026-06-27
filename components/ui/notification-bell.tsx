import Link from "next/link";

export function NotificationBell() {
  return (
    <Link
      href="/notifications"
      aria-label="Ver notificaciones"
      className="relative grid size-10 place-items-center rounded-full bg-white/80 text-sm font-black text-[#1F3D2B] transition-colors hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#3A7D4424]"
    >
      <span aria-hidden="true">!</span>
      <span className="absolute right-2 top-2 size-2 rounded-full bg-[#D9A441]" />
    </Link>
  );
}
