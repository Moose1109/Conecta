import { Card } from "@/components/ui/card";

export function LoadingState({ label = "Cargando contenido" }: { label?: string }) {
  return (
    <Card className="p-6">
      <div className="h-4 w-36 animate-pulse rounded-full bg-[#1F3D2B14]" />
      <div className="mt-5 grid gap-3">
        <div className="h-20 animate-pulse rounded-2xl bg-[#1F3D2B0d]" />
        <div className="h-20 animate-pulse rounded-2xl bg-[#1F3D2B0d]" />
      </div>
      <p className="sr-only">{label}</p>
    </Card>
  );
}
