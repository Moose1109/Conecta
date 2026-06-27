import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function MockActionButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-full px-3 text-sm font-bold text-[#1F3D2B]/72 transition-colors hover:bg-[#1F3D2B0d] hover:text-[#1F3D2B] focus:outline-none focus:ring-4 focus:ring-[#3A7D4420]",
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
