import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { LoginForm } from "@/features/auth/login-form";

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
          <LoginForm />
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
