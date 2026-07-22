"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") console.error("ConectaPueblos render error:", error);
  }, [error]);

  return (
    <main className="page-shell grid min-h-[70dvh] place-items-center py-12">
      <Card className="w-full max-w-xl p-8 text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[#C96D4A1f] text-[#A95539]"><AlertTriangle aria-hidden="true" className="size-7" /></span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-[-0.035em] text-[#18231D]">Algo no ha salido como esperábamos</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#687269]">Ha ocurrido un problema inesperado. Puedes reintentar sin perder tu sesión.</p>
        <Button className="mt-6" type="button" onClick={reset}><RotateCcw aria-hidden="true" className="size-4" />Intentar de nuevo</Button>
      </Card>
    </main>
  );
}
