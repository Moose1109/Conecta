import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getVillages } from "@/lib/api/villages.service";

export default function RegisterPage() {
  const villages = getVillages();

  return (
    <>
      <Navbar />
      <main className="page-shell grid min-h-[calc(100vh-4rem)] place-items-center py-12">
        <Card className="w-full max-w-xl p-7">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#3A7D44]">
            Registro mock
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#1F3D2B]">
            Únete a ConectaPueblos
          </h1>
          <form className="mt-6 grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="label" htmlFor="name">
                  Nombre
                </label>
                <input className="field" id="name" placeholder="Ana" />
              </div>
              <div>
                <label className="label" htmlFor="email">
                  Email
                </label>
                <input className="field" id="email" placeholder="ana@pueblo.es" type="email" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="favorite">
                Pueblo favorito
              </label>
              <select className="field" id="favorite" defaultValue="">
                <option value="" disabled>
                  Selecciona un pueblo
                </option>
                {villages.map((village) => (
                  <option key={village.id} value={village.id}>
                    {village.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="password">
                Contraseña
              </label>
              <input className="field" id="password" placeholder="••••••••" type="password" />
            </div>
            <Button type="button" className="w-full">
              Crear cuenta mock
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-[#1E1E1E]/62">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="font-bold text-[#3A7D44]">
              Entra
            </Link>
          </p>
        </Card>
      </main>
    </>
  );
}
