import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[#1F3D2B12] bg-[#1F3D2B] text-white">
      <div className="page-shell grid gap-8 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-xl font-black">ConectaPueblos</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-white/72">
            Una plataforma para descubrir pueblos, sumarte a actividades locales
            y cuidar la vida comunitaria desde lo cercano.
          </p>
        </div>
        <div>
          <p className="font-bold">Explorar</p>
          <div className="mt-3 grid gap-2 text-sm text-white/72">
            <Link href="/villages">Pueblos</Link>
            <Link href="/activities">Actividades</Link>
            <Link href="/community">Comunidad</Link>
          </div>
        </div>
        <div>
          <p className="font-bold">Cuenta</p>
          <div className="mt-3 grid gap-2 text-sm text-white/72">
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/profile">Perfil</Link>
            <Link href="/admin">Admin mock</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
