import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

const base =
  "inline-flex w-full min-h-16 items-center justify-center gap-3 rounded-2xl border-2 px-6 py-4 text-xl font-bold transition-colors";

const variants = {
  primary: "border-primary bg-primary text-primary-foreground hover:bg-primary/90",
  secondary: "border-border bg-card text-foreground hover:bg-secondary",
  danger: "border-destructive bg-card text-destructive hover:bg-spend-soft",
  success: "border-success bg-success text-success-foreground hover:bg-success/90",
} as const;

export type BigButtonVariant = keyof typeof variants;

export function BigButton({
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<"button"> & { variant?: BigButtonVariant; children: ReactNode }) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function BigLink({
  to,
  variant = "primary",
  className,
  children,
}: {
  to: string;
  variant?: BigButtonVariant;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link to={to} className={cn(base, variants[variant], className)}>
      {children}
    </Link>
  );
}
