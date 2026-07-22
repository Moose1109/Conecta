import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "terracotta" | "mustard";

const variants: Record<Variant, string> = {
  primary: "bg-[#184B34] text-white shadow-[0_10px_24px_rgba(24,75,52,0.18)] hover:bg-[#0E3325]",
  secondary:
    "border border-[#184B3424] bg-white/88 text-[#184B34] hover:border-[#184B3438] hover:bg-white",
  ghost: "text-[#184B34] hover:bg-[#184B340d]",
  terracotta: "bg-[#C96D4A] text-white shadow-sm hover:bg-[#A95539]",
  mustard: "bg-[#D7A63C] text-[#18231D] shadow-sm hover:bg-[#C8952D]",
};

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-extrabold transition-[background-color,border-color,color,box-shadow,transform] duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#347A4824] disabled:translate-y-0 disabled:opacity-60";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: Variant;
};

export function LinkButton({
  className,
  variant = "primary",
  href,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <Link className={cn(base, variants[variant], className)} href={href} {...props}>
      {children}
    </Link>
  );
}
