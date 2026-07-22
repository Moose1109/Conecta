import { Search } from "lucide-react";

export function SearchInput({
  placeholder = "Buscar en ConectaPueblos",
  label = "Buscar",
  value,
  onChange,
}: {
  placeholder?: string;
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="relative block">
      <span className="sr-only">{label}</span>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#60818A]"
        strokeWidth={2}
      />
      <input
        aria-label={label}
        className="min-h-12 w-full rounded-full border border-[#184B341c] bg-white/90 py-2 pl-11 pr-5 text-sm font-semibold text-[#18231D] shadow-[0_8px_24px_rgba(43,55,38,0.05)] outline-none transition focus:border-[#347A48] focus:ring-4 focus:ring-[#347A481c]"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        type="search"
      />
    </label>
  );
}
