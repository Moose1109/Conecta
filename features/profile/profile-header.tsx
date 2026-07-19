"use client";

import Image from "next/image";
import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { UserAvatar } from "@/components/social/user-avatar";
import type { AuthUser } from "@/lib/types";

function profileHandle(user?: AuthUser) {
  if (user?.username) {
    return `@${user.username.replace(/^@/, "")}`;
  }

  if (user?.email) {
    return user.email;
  }

  return "Cuenta de ConectaPueblos";
}

function isSafeImageUrl(value: string | undefined) {
  return Boolean(value && value.trim());
}

export function ProfileHeader({ user }: { user?: AuthUser }) {
  const name = user?.name ?? "Tu perfil";
  const handle = profileHandle(user);
  const bannerUrl = isSafeImageUrl(user?.bannerUrl) ? user?.bannerUrl : undefined;
  const bio = user?.bio;
  const role = user?.role;

  return (
    <Card className="overflow-hidden">
      <div className="relative min-h-44 bg-[#1F3D2B] sm:min-h-52 md:min-h-60">
        {bannerUrl ? (
          <Image
            src={bannerUrl}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#1F3D2B_0%,#3A7D44_48%,#D9A441_100%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F3D2B]/78 via-[#1F3D2B]/20 to-transparent" />
      </div>

      <div className="px-5 pb-6 md:px-8 md:pb-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="-mt-14 flex min-w-0 flex-col gap-4 sm:-mt-12 sm:flex-row sm:items-end">
            <UserAvatar
              name={name}
              imageUrl={user?.avatarUrl}
              className="size-24 shrink-0 text-3xl ring-4 ring-[#FAF7F0] sm:size-28"
            />
            <div className="min-w-0 pb-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="min-w-0 text-3xl font-black leading-tight text-[#1F3D2B] md:text-4xl">
                  {name}
                </h1>
                {role ? (
                  <span className="rounded-full bg-[#D9A44124] px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-[#1F3D2B]">
                    {role}
                  </span>
                ) : null}
              </div>
              <p className="mt-1 break-words text-sm font-black text-[#3A7D44]">{handle}</p>
            </div>
          </div>
          <LinkButton href="/settings" variant="secondary" className="self-start sm:mt-5">
            Editar perfil
          </LinkButton>
        </div>

        {bio ? (
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#1E1E1E]/68">{bio}</p>
        ) : (
          <p className="mt-5 max-w-2xl text-sm leading-6 text-[#1E1E1E]/58">
            Añade una bio corta para contar quién eres y qué pueblos te interesan.
          </p>
        )}
      </div>
    </Card>
  );
}
