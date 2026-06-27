import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <Card className="p-8 text-center">
      <p className="text-xl font-black text-[#1F3D2B]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#1E1E1E]/62">
        {description}
      </p>
    </Card>
  );
}
