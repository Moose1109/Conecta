import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="page-shell grid min-h-[calc(100vh-4rem)] place-items-center py-12">
        <Card className="w-full max-w-md p-7">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#3A7D44]">
            Acceso demo
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#1F3D2B]">Entrar</h1>
          <form className="mt-6 grid gap-5">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input className="field" id="email" placeholder="ana@pueblo.es" type="email" />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Contraseña
              </label>
              <input className="field" id="password" placeholder="••••••••" type="password" />
            </div>
            <Button type="button" className="w-full">
              Entrar al dashboard
            </Button>
          </form>
          <p className="mt-5 text-center text-sm text-[#1E1E1E]/62">
            ¿Aún no tienes cuenta?{" "}
            <Link href="/register" className="font-bold text-[#3A7D44]">
              Regístrate
            </Link>
          </p>
        </Card>
      </main>
    </>
  );
}
