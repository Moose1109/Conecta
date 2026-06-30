import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Card } from "@/components/ui/card";
import { RegisterForm } from "@/features/auth/register-form";
import { getVillages } from "@/lib/api/villages.service";

export default async function RegisterPage() {
  const villages = await getVillages();

  return (
    <>
      <Navbar />
      <main className="page-shell grid min-h-[calc(100vh-4rem)] place-items-center py-12">
        <Card className="w-full max-w-xl p-7">
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#3A7D44]">
            Registro demo
          </p>
          <h1 className="mt-3 text-3xl font-black text-[#1F3D2B]">
            Únete a ConectaPueblos
          </h1>
          <RegisterForm villages={villages} />
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
