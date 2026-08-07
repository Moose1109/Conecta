import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SocialActionButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-xs font-extrabold text-[#677168] transition-colors duration-200 hover:bg-[#184B3409] hover:text-[#184B34] focus:outline-none focus:ring-4 focus:ring-[#184B34] focus:ring-offset-2 focus:ring-offset-[#F7F2E8] disabled:opacity-55 sm:text-[13px]",
        className,
      )}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
}
