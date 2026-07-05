"use client";

import Image from "next/image";
import { UserAvatar } from "@/components/social/user-avatar";
import { Card } from "@/components/ui/card";
import { useAuthSession } from "@/features/auth/use-auth-session";

const fallbackBanner =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80";

export function ProfileSummary() {
  const { user } = useAuthSession();
  const name = user?.name ?? "Usuario";
  const username = user?.username ? `@${user.username.replace(/^@/, "")}` : "@conectapueblos";
  const banner = user?.bannerUrl ?? fallbackBanner;
  const description =
    user?.bio ??
    (user
      ? `${user.role ?? "Miembro de la comunidad"} en ConectaPueblos.`
      : "Inicia sesión para ver tu perfil real de ConectaPueblos.");

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 md:h-64">
        <Image
          src={banner}
          alt={`Banner de ${name}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B]/78 to-transparent" />
      </div>
      <div className="px-5 pb-6 md:px-8">
        <div className="-mt-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-end gap-4">
            <UserAvatar
              name={name}
              imageUrl={user?.avatarUrl}
              className="size-24 text-3xl"
            />
            <div className="pb-2">
              <h1 className="text-3xl font-black text-[#1F3D2B]">{name}</h1>
              <p className="font-bold text-[#3A7D44]">{username}</p>
            </div>
          </div>
          <button
            className="min-h-11 rounded-full bg-[#3A7D44] px-5 text-sm font-black text-white disabled:opacity-60"
            type="button"
            disabled
          >
            Editar perfil
          </button>
        </div>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-[#1E1E1E]/68">
          {description}
        </p>
      </div>
    </Card>
  );
}
