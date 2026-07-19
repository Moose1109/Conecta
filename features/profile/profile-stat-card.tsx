import { Card } from "@/components/ui/card";

export function ProfileStatCard({
  label,
  value,
  note,
}: {
  label: string;
  value: number;
  note: string;
}) {
  return (
    <Card className="p-5">
      <p className="text-sm font-bold text-[#1E1E1E]/52">{label}</p>
      <p className="mt-2 text-3xl font-black text-[#1F3D2B]">{value}</p>
      <p className="mt-2 text-xs font-bold leading-5 text-[#1E1E1E]/50">{note}</p>
    </Card>
  );
}
