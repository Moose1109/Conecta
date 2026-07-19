import { LinkButton } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ProfileEmptyState({
  actionHref,
  actionLabel,
  description,
  title,
}: {
  actionHref: string;
  actionLabel: string;
  description: string;
  title: string;
}) {
  return (
    <Card className="p-7 text-center">
      <p className="text-xl font-black text-[#1F3D2B]">{title}</p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#1E1E1E]/62">
        {description}
      </p>
      <div className="mt-6">
        <LinkButton href={actionHref} variant="secondary">
          {actionLabel}
        </LinkButton>
      </div>
    </Card>
  );
}
