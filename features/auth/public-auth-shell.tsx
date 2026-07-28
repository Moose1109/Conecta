import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  CalendarDays,
  HeartHandshake,
  LockKeyhole,
  MapPin,
  Megaphone,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const signals = [
  { icon: MapPin, label: "Actividades cerca" },
  { icon: HeartHandshake, label: "Pueblos con vida" },
  { icon: UsersRound, label: "Comunidad local" },
];

const stories = [
  {
    eyebrow: "Publicación local",
    icon: Megaphone,
    image: "/images/raiz-village-hero.webp",
    title: "Comparte lo que importa",
    text: "Avisos, noticias y recomendaciones para tu comunidad.",
  },
  {
    eyebrow: "Actividades cerca",
    icon: CalendarDays,
    image: "/images/raiz-market.webp",
    title: "Descubre planes y eventos",
    text: "Mercados, rutas, talleres y fiestas con raíz local.",
  },
  {
    eyebrow: "Pueblos con vida",
    icon: MapPin,
    image: "/images/raiz-village-hero.webp",
    title: "Explora pueblos únicos",
    text: "Sigue lugares, conoce su historia y participa en su día a día.",
  },
];

export function PublicAuthShell({
  children,
  discovery,
}: {
  children: ReactNode;
  discovery?: ReactNode;
}) {
  return (
    <main className="min-h-dvh bg-[#F7F2E8] p-2 text-[#18231D] sm:p-5 lg:p-7 xl:p-9">
      <div className="mx-auto grid min-h-[calc(100dvh-1rem)] max-w-[1540px] overflow-hidden rounded-[24px] border border-white/80 bg-[#FFFCF7]/72 shadow-[0_30px_100px_rgba(45,52,39,0.16)] sm:min-h-[calc(100dvh-2.5rem)] sm:rounded-[34px] lg:grid-cols-[minmax(0,1.42fr)_minmax(430px,0.92fr)] xl:min-h-[calc(100dvh-4.5rem)]">
        <section className="auth-hero-shell order-2 p-2 sm:p-5 lg:order-1 lg:p-0">
          <div className="auth-hero-card relative flex min-h-[360px] overflow-hidden rounded-[22px] bg-[#0E3325] text-white sm:min-h-[600px] sm:rounded-[30px] lg:min-h-full lg:rounded-[32px]">
            <Image
              alt="Pueblo de piedra entre montañas al atardecer"
              className="object-cover object-center lg:object-[58%_center]"
              fill
              preload
              sizes="(max-width: 1023px) 100vw, 62vw"
              src="/images/raiz-village-hero.webp"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,42,29,0.96)_0%,rgba(10,49,33,0.84)_44%,rgba(8,36,26,0.3)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#082A1D] via-transparent to-[#0E3325]/16" />
            <div aria-hidden="true" className="absolute -right-10 top-8 size-64 rounded-full border border-white/10 opacity-60" />
            <div aria-hidden="true" className="absolute -right-2 top-20 size-40 rounded-full border border-[#D7A63C]/20 opacity-60" />

            <div className="relative z-10 flex w-full flex-col p-5 sm:p-8 lg:p-10 xl:p-12">
              <Link className="flex w-fit items-center gap-3 font-extrabold tracking-[-0.02em] text-white" href="/">
                <span className="grid size-11 place-items-center rounded-full bg-[#D7A63C] text-sm font-black text-[#0E3325] shadow-[0_14px_30px_rgba(215,166,60,0.22)] sm:size-12 sm:text-base">CP</span>
                <span className="text-lg sm:text-xl">ConectaPueblos</span>
              </Link>

              <div className="mt-6 max-w-3xl sm:mt-10 xl:mt-14">
                <p className="inline-flex items-center gap-2 rounded-full border border-[#D7A63C]/34 bg-[#D7A63C]/12 px-3 py-2 text-[11px] font-extrabold text-[#F4C75E] backdrop-blur sm:px-4 sm:text-sm">
                  <UsersRound aria-hidden="true" className="size-4" />
                  Red social local para pueblos, planes y comunidad
                </p>
                <p className="mt-4 text-[clamp(2.15rem,10vw,5.4rem)] font-extrabold leading-[0.98] tracking-[-0.055em] text-white sm:mt-6">
                  Tu pueblo.<br />
                  Tu gente.<br />
                  <span className="text-[#E3B447]">Tu comunidad.</span>
                </p>
                <p className="mt-4 max-w-xl text-sm font-medium leading-6 text-white/82 sm:mt-6 sm:text-lg sm:leading-8">
                  Conecta con vecinos, descubre actividades, comparte lo que pasa en tu pueblo y apoya las iniciativas locales.
                </p>
              </div>

              <div className="mt-6 hidden flex-wrap gap-2 min-[430px]:flex">
                {signals.map(({ icon: Icon, label }) => (
                  <span className="inline-flex min-h-9 items-center gap-2 rounded-full border border-white/22 bg-white/9 px-4 text-xs font-bold text-white/90 backdrop-blur" key={label}>
                    <Icon aria-hidden="true" className="size-4" strokeWidth={1.8} />
                    {label}
                  </span>
                ))}
              </div>

              {!discovery ? (
                <div className="mt-auto hidden gap-3 pt-8 sm:grid sm:grid-cols-3">
                  {stories.map(({ eyebrow, icon: Icon, image, text, title }) => (
                    <article className="group relative min-h-[220px] overflow-hidden rounded-[22px] border border-white/22 bg-[#0E3325]/46 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-sm" key={title}>
                      <Image alt="" aria-hidden="true" className="object-cover opacity-28 transition-transform duration-200 group-hover:scale-[1.02]" fill sizes="250px" src={image} />
                      <div className="absolute inset-0 bg-gradient-to-b from-[#0E3325]/60 via-[#0E3325]/76 to-[#0E3325]/96" />
                      <div className="relative flex h-full flex-col">
                        <span className="grid size-11 place-items-center rounded-full bg-[#D7A63C]/20 text-[#F0BC43]">
                          <Icon aria-hidden="true" className="size-5" />
                        </span>
                        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.14em] text-[#E7B13B]">{eyebrow}</p>
                        <h2 className="mt-2 text-lg font-extrabold leading-6 text-white">{title}</h2>
                        <p className="mt-2 text-xs font-medium leading-5 text-white/68">{text}</p>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}

              <p className="mt-auto flex items-center gap-2 pt-5 text-xs font-semibold text-white/78 sm:mt-6 sm:pt-0 sm:text-sm">
                <span className="grid size-8 place-items-center rounded-lg bg-[#347A48] text-white"><ShieldCheck aria-hidden="true" className="size-4" /></span>
                Hecho para pueblos. Pensado para personas.
              </p>
            </div>
          </div>
        </section>

        <section className="order-1 flex items-center justify-center p-2 sm:p-7 lg:order-2 lg:p-8 xl:p-10">
          <div className="w-full max-w-[500px]">
            {children}
            <div className="mt-3 flex items-center gap-3 rounded-[20px] border border-[#D7A63C]/30 bg-[#FFF8EC] p-3 text-[#184B34] sm:mt-5 sm:rounded-[22px] sm:p-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white shadow-sm"><LockKeyhole aria-hidden="true" className="size-5" /></span>
              <div>
                <p className="text-sm font-extrabold">Tu información está segura con nosotros.</p>
                <p className="mt-1 text-xs font-medium text-[#687269]">No compartimos tus datos con terceros.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
      {discovery ? (
        <div className="mx-auto mt-8 max-w-[1540px] sm:mt-10 lg:mt-12">
          {discovery}
        </div>
      ) : null}
    </main>
  );
}
