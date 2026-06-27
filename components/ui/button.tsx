import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary: "bg-[#3A7D44] text-white shadow-sm hover:bg-[#2f6738]",
  secondary:
    "border border-[#1F3D2B24] bg-white/88 text-[#1F3D2B] hover:bg-white",
  ghost: "text-[#1F3D2B] hover:bg-[#1F3D2B0d]",
};

const base =
  "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition-colors focus:outline-none focus:ring-4 focus:ring-[#3A7D4424]";

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
