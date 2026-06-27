export function SearchInput({
  placeholder = "Buscar en ConectaPueblos",
  label = "Buscar",
}: {
  placeholder?: string;
  label?: string;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <input
        aria-label={label}
        className="min-h-12 w-full rounded-full border border-[#1F3D2B18] bg-white/88 px-5 text-sm font-bold text-[#1F3D2B] outline-none transition focus:border-[#3A7D44] focus:ring-4 focus:ring-[#3A7D4420]"
        placeholder={placeholder}
        type="search"
      />
    </label>
  );
}
