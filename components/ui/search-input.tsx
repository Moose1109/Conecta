import { Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchInput({
  className,
  id,
  name,
  appearance = "pill",
  placeholder,
  label,
  clearLabel,
  value,
  onChange,
  onClear,
  showFilterHint = false,
}: {
  className?: string;
  id?: string;
  name?: string;
  appearance?: "pill" | "embedded";
  placeholder: string;
  label: string;
  /** Accessible label for the clear button; falls back to `label` when omitted. */
  clearLabel?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  showFilterHint?: boolean;
}) {
  const hasValue = Boolean(value);

  return (
    <label className={cn("relative block min-w-0", className)}>
      <span className="sr-only">{label}</span>
      <Search
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-mineral",
          appearance === "embedded" ? "size-5" : "size-4",
        )}
        strokeWidth={appearance === "embedded" ? 1.8 : 2}
      />
      <input
        aria-label={label}
        className={cn(
          "min-h-12 w-full py-2 pl-11 text-sm font-semibold text-text-primary outline-none transition placeholder:text-text-muted/80 focus:border-forest-mid focus:ring-4 focus:ring-[#184B34] focus:ring-offset-2 focus:ring-offset-[#F7F2E8]",
          appearance === "embedded"
            ? "rounded-[17px] border-0 bg-transparent pr-12 focus:bg-white sm:min-h-14 sm:text-[15px]"
            : "rounded-full border border-[#184B341c] bg-white/90 pr-12 shadow-[0_8px_24px_rgba(43,55,38,0.05)]",
        )}
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        type="search"
      />
      {hasValue && onClear ? (
        <button
          aria-label={clearLabel ?? label}
          className="absolute right-1 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full text-text-muted transition-colors hover:bg-[#184B340a] hover:text-primary"
          onClick={onClear}
          type="button"
        >
          <X aria-hidden="true" className="size-[18px]" />
        </button>
      ) : showFilterHint ? (
        <SlidersHorizontal
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 size-[18px] -translate-y-1/2 text-primary"
          strokeWidth={1.8}
        />
      ) : null}
    </label>
  );
}
