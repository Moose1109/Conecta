"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UserAvatar } from "@/components/social/user-avatar";
import { isAdminUser } from "@/features/auth/roles";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { clearSession } from "@/lib/api/session";
import { cn } from "@/lib/utils";

const accountLinks = [
  {
    href: "/dashboard",
    label: "Mi espacio",
    meta: "Tu resumen personal",
  },
  {
    href: "/profile",
    label: "Mi perfil",
    meta: "Datos y actividad",
  },
  {
    href: "/notifications",
    label: "Notificaciones",
    meta: "Avisos de tu cuenta",
  },
  {
    href: "/settings",
    label: "Configuración",
    meta: "Preferencias",
  },
];

export function UserMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const name = user?.name ?? user?.username ?? "Usuario";
  const displayName = user?.username ?? user?.name ?? "Mi cuenta";

  useEffect(() => {
    if (!open) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  function handleLogout() {
    setOpen(false);
    clearSession();
    router.refresh();
    router.push("/");
  }

  function isActive(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex min-h-11 items-center gap-2 rounded-full border border-[#1F3D2B12] bg-white/78 py-1 pl-1 pr-3 text-sm font-black text-[#1F3D2B] shadow-sm transition-colors hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#3A7D4424]"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <UserAvatar
          name={name}
          imageUrl={user?.avatarUrl}
          className="size-9 text-xs ring-0"
        />
        <span className="hidden max-w-32 truncate sm:block">{displayName}</span>
        <span
          aria-hidden="true"
          className={cn("text-xs transition-transform", open && "rotate-180")}
        >
          v
        </span>
      </button>

      {open ? (
        <div
          className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-2xl border border-[#1F3D2B14] bg-[#FAF7F0] p-2 text-[#1F3D2B] shadow-[0_24px_70px_rgba(31,61,43,0.22)]"
          role="menu"
        >
          <div className="flex gap-3 border-b border-[#1F3D2B12] p-3">
            <UserAvatar
              name={name}
              imageUrl={user?.avatarUrl}
              className="size-12 text-sm ring-0"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-black">{name}</p>
              {user?.email ? (
                <p className="mt-1 truncate text-xs font-bold text-[#1E1E1E]/56">
                  {user.email}
                </p>
              ) : (
                <p className="mt-1 text-xs font-bold text-[#1E1E1E]/56">
                  Tu espacio personal
                </p>
              )}
            </div>
          </div>

          <div className="py-2">
            {accountLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/80",
                  isActive(link.href) && "bg-white text-[#3A7D44] shadow-sm",
                )}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <span className="block text-sm font-black">{link.label}</span>
                <span className="mt-0.5 block text-xs font-bold text-[#1E1E1E]/52">
                  {link.meta}
                </span>
              </Link>
            ))}
          </div>

          {isAdminUser(user) ? (
            <div className="border-t border-[#1F3D2B12] py-2">
              <Link
                href="/admin"
                className={cn(
                  "block rounded-xl px-3 py-2.5 transition-colors hover:bg-white/80",
                  isActive("/admin") && "bg-white text-[#3A7D44] shadow-sm",
                )}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                <span className="block text-sm font-black">Panel admin</span>
                <span className="mt-0.5 block text-xs font-bold text-[#1E1E1E]/52">
                  Gestión del proyecto
                </span>
              </Link>
            </div>
          ) : null}

          <div className="border-t border-[#1F3D2B12] pt-2">
            <button
              className="block w-full rounded-xl px-3 py-2.5 text-left text-sm font-black text-[#8A2E1B] transition-colors hover:bg-white/80"
              role="menuitem"
              type="button"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
