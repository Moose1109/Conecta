"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthIcon, type AuthIconName } from "@/features/auth/auth-icons";
import { LoginForm } from "@/features/auth/login-form";
import { RegisterForm } from "@/features/auth/register-form";
import { useAuthSession } from "@/features/auth/use-auth-session";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Village } from "@/lib/types";

type AuthMode = "login" | "register";

const previewCards = [
  {
    eyebrow: "Publicación local",
    icon: "megaphone",
    title: "Nuevo aviso en la comunidad",
    text: "Vecinos y visitantes comparten recomendaciones, rutas y necesidades del pueblo.",
  },
  {
    eyebrow: "Actividad próxima",
    icon: "calendar",
    title: "Mercado local este sábado",
    text: "Planes con raíz local para descubrir el territorio desde dentro.",
  },
  {
    eyebrow: "Pueblo recomendado",
    icon: "map-pin",
    title: "Pueblos vivos por descubrir",
    text: "Sigue pueblos para recibir novedades, actividades y conversaciones.",
  },
] satisfies Array<{
  eyebrow: string;
  icon: AuthIconName;
  title: string;
  text: string;
}>;

const socialSignals = [
  { icon: "map-pin", label: "Actividades cerca" },
  { icon: "heart", label: "Pueblos vivos" },
  { icon: "users", label: "Comunidad local" },
] satisfies Array<{ icon: AuthIconName; label: string }>;

const villageLights = [
  "left-[54%] top-[55%]",
  "left-[61%] top-[51%]",
  "left-[68%] top-[58%]",
  "left-[74%] top-[49%]",
  "left-[79%] top-[56%]",
];

const leaves = [
  "right-8 top-28 rotate-[24deg]",
  "right-16 top-36 rotate-[42deg]",
  "right-3 top-40 rotate-[8deg]",
  "right-24 top-44 rotate-[62deg]",
  "right-12 top-52 rotate-[30deg]",
];

export function AuthLanding({ villages }: { villages: Village[] }) {
  const router = useRouter();
  const { token } = useAuthSession();
  const [mode, setMode] = useState<AuthMode>("login");

  useEffect(() => {
    if (token) {
      router.replace("/community");
    }
  }, [router, token]);

  if (token) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#F8F2E8] px-5">
        <Card className="auth-fade-scale w-full max-w-sm rounded-[32px] border-white/80 bg-white/95 p-6 text-center shadow-[0_24px_70px_rgba(21,63,43,0.16)]">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-[#2F7D3C]">
            ConectaPueblos
          </p>
          <h1 className="mt-3 text-2xl font-black text-[#173F2A]">
            Abriendo comunidad
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#5E6F63]">
            Ya tienes sesión iniciada. Te llevamos al feed social.
          </p>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F2E8] text-[#173F2A]">
      <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,1.22fr)_minmax(420px,0.78fr)] lg:items-center lg:px-10 lg:py-12">
        <div className="auth-hero-shell auth-fade-up">
          <section className="auth-hero-card relative overflow-hidden rounded-[36px] bg-[#0F3424] px-6 py-8 text-white sm:rounded-[42px] sm:px-8 sm:py-10 lg:min-h-[calc(100vh-6rem)] lg:px-10 lg:py-12">
            <div className="absolute inset-0 bg-[#0F3424]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_31%_18%,rgba(87,132,75,0.72),transparent_34%),radial-gradient(circle_at_76%_42%,rgba(223,175,55,0.24),transparent_30%),linear-gradient(135deg,#153F2B_0%,#0E2F21_54%,#234C2E_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,38,25,0.86)_0%,rgba(13,55,35,0.58)_44%,rgba(9,32,24,0.72)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-[52%] opacity-70">
              <div
                className="absolute inset-x-[-8%] bottom-[-6%] h-[78%] bg-gradient-to-t from-[#0B2419] via-[#1E4C2B] to-[#3F6F3B]"
                style={{ clipPath: "polygon(0 45%, 14% 28%, 30% 42%, 46% 20%, 61% 34%, 76% 18%, 100% 30%, 100% 100%, 0 100%)" }}
              />
              <div
                className="absolute inset-x-[-4%] bottom-[-8%] h-[58%] bg-gradient-to-t from-[#0A2017] via-[#173F2A] to-[#597F3F]"
                style={{ clipPath: "polygon(0 56%, 18% 38%, 34% 55%, 52% 31%, 70% 48%, 88% 29%, 100% 42%, 100% 100%, 0 100%)" }}
              />
              {villageLights.map((position) => (
                <span
                  className={cn(
                    "absolute grid size-5 place-items-center rounded-[4px] bg-[#DFAF37]/70 shadow-[0_0_18px_rgba(223,175,55,0.38)]",
                    position,
                  )}
                  key={position}
                >
                  <span className="size-2 rounded-full bg-white/70" />
                </span>
              ))}
            </div>
            <div aria-hidden="true" className="absolute inset-0 opacity-35">
              {leaves.map((position) => (
                <span
                  className={cn(
                    "absolute block h-4 w-14 rounded-[100%_0] bg-[#9AB46D]/60 blur-[0.2px]",
                    position,
                  )}
                  key={position}
                />
              ))}
            </div>
            <div className="relative z-10 flex min-h-full flex-col">
              <div className="flex items-center justify-between gap-4">
                <Link href="/" className="flex items-center gap-3 font-black text-white">
                  <span className="grid size-12 place-items-center rounded-full bg-[#DFAF37] text-lg text-[#173F2A] shadow-[0_12px_28px_rgba(223,175,55,0.28)]">
                    CP
                  </span>
                  <span className="text-lg sm:text-xl">ConectaPueblos</span>
                </Link>
                <Link
                  href="/community"
                  className="hidden min-h-11 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-black text-white/90 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20 sm:inline-flex"
                >
                  <span>Ver comunidad</span>
                  <AuthIcon className="size-4" name="arrow-right" />
                </Link>
              </div>

              <div className="mt-12 max-w-3xl lg:mt-16">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#DFAF37]/20 bg-[#DFAF37]/20 px-4 py-2 text-sm font-black text-[#DFAF37] shadow-sm backdrop-blur">
                  <AuthIcon className="size-5" name="users" />
                  Red social local para pueblos, planes y comunidad
                </p>
                <h1 className="mt-6 text-4xl font-black leading-[1.08] text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.20)] sm:text-5xl lg:text-7xl">
                  La red social para
                  <br />
                  pueblos que
                  <br />
                  siguen latiendo.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
                  Descubre actividades locales, comparte publicaciones y conecta con
                  pueblos llenos de historia, vida vecinal y planes con raíz.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {socialSignals.map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-black text-white/90 shadow-sm backdrop-blur transition-transform hover:-translate-y-0.5"
                  >
                    <AuthIcon className="size-4" name={item.icon} />
                    {item.label}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-auto">
                {previewCards.map((card, index) => (
                  <article
                    key={card.title}
                    className={cn(
                      "auth-fade-up rounded-[24px] border border-white/20 bg-white/[0.09] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_20px_50px_rgba(0,0,0,0.18)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/[0.12]",
                      index === 1 && "auth-stagger-1",
                      index === 2 && "auth-stagger-2",
                    )}
                  >
                    <span className="grid size-11 place-items-center rounded-full bg-[#DFAF37]/20 text-[#DFAF37]">
                      <AuthIcon className="size-5" name={card.icon} />
                    </span>
                    <p className="text-xs font-black uppercase tracking-[0.14em] text-[#D9A441]">
                      {card.eyebrow}
                    </p>
                    <h2 className="mt-3 text-lg font-black leading-snug text-white">
                      {card.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-white/70">{card.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="flex items-center justify-center pb-6 lg:pb-0">
          <Card className="auth-fade-scale w-full max-w-[460px] rounded-[32px] border-white/80 bg-white/95 p-6 shadow-[0_28px_90px_rgba(21,63,43,0.16)] sm:p-8">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#2F7D3C]">
              Entra a ConectaPueblos
            </p>
            <h2 className="mt-4 text-3xl font-black leading-tight text-[#173F2A] sm:text-4xl">
              Tu comunidad local
              <br />
              empieza aquí
            </h2>
            <p className="mt-5 text-sm leading-7 text-[#5E6F63]">
              Accede para publicar, apuntarte a actividades y seguir pueblos que
              quieres tener cerca.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-1 rounded-[18px] bg-[#EEF1ED] p-1 shadow-inner">
              <button
                className={cn(
                  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] text-sm font-black transition-all focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]",
                  mode === "login"
                    ? "bg-white text-[#173F2A] shadow-[0_10px_24px_rgba(21,63,43,0.10)]"
                    : "text-[#5E6F63] hover:text-[#173F2A]",
                )}
                type="button"
                onClick={() => setMode("login")}
              >
                <AuthIcon className="size-5" name="user" />
                Iniciar sesión
              </button>
              <button
                className={cn(
                  "inline-flex min-h-12 items-center justify-center gap-2 rounded-[14px] text-sm font-black transition-all focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]",
                  mode === "register"
                    ? "bg-white text-[#173F2A] shadow-[0_10px_24px_rgba(21,63,43,0.10)]"
                    : "text-[#5E6F63] hover:text-[#173F2A]",
                )}
                type="button"
                onClick={() => setMode("register")}
              >
                <AuthIcon className="size-5" name="plus" />
                Crear cuenta
              </button>
            </div>

            {mode === "login" ? (
              <>
                <LoginForm />
                <p className="mt-5 text-center text-sm text-[#1E1E1E]/60">
                  ¿Aún no tienes cuenta?{" "}
                  <button
                    className="font-bold text-[#2F7D3C] transition-colors hover:text-[#17622E]"
                    type="button"
                    onClick={() => setMode("register")}
                  >
                    Crear cuenta
                  </button>
                </p>
              </>
            ) : (
              <>
                <RegisterForm villages={villages} />
                <p className="mt-5 text-center text-sm text-[#1E1E1E]/60">
                  ¿Ya tienes cuenta?{" "}
                  <button
                    className="font-bold text-[#2F7D3C] transition-colors hover:text-[#17622E]"
                    type="button"
                    onClick={() => setMode("login")}
                  >
                    Iniciar sesión
                  </button>
                </p>
              </>
            )}
          </Card>
        </section>
      </div>
    </main>
  );
}
