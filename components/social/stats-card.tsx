export function StatsCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[#1F3D2B12] bg-white/76 p-4">
      <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#1E1E1E]/48">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black text-[#1F3D2B]">{value}</p>
    </div>
  );
}
