import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

export function ErrorState({
  title = "No hemos podido cargar esto",
  description = "Prueba de nuevo o vuelve al inicio social.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <Card className="p-8 text-center">
      <p className="text-2xl font-black text-[#1F3D2B]">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#1E1E1E]/62">
        {description}
      </p>
      <div className="mt-6">
        <LinkButton href="/dashboard">Volver al inicio</LinkButton>
      </div>
    </Card>
  );
}
