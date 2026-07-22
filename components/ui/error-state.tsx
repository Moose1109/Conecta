import { AlertTriangle, WifiOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LinkButton } from "@/components/ui/button";

export function ErrorState({
  title = "No hemos podido cargar este contenido",
  description = "Ha ocurrido un problema inesperado. Inténtalo de nuevo en unos minutos.",
  actionHref = "/community",
  actionLabel = "Ir a comunidad",
  network = false,
}: {
  title?: string;
  description?: string;
  actionHref?: string;
  actionLabel?: string;
  network?: boolean;
}) {
  const Icon = network ? WifiOff : AlertTriangle;

  return (
    <Card className="p-7 text-center sm:p-9">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#C96D4A1f] text-[#A95539]">
        <Icon aria-hidden="true" className="size-6" />
      </span>
      <h2 className="mt-5 text-2xl font-extrabold tracking-[-0.025em] text-[#18231D]">{title}</h2>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#687269]">{description}</p>
      <div className="mt-6">
        <LinkButton href={actionHref}>{actionLabel}</LinkButton>
      </div>
    </Card>
  );
}
