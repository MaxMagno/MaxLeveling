import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost" | "violet" | "danger";

export function NeonButton({
  children, variant = "primary", className = "", ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; children: ReactNode }) {
  const base = "relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-display text-sm tracking-wider uppercase transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed";
  const styles: Record<Variant, string> = {
    primary: "bg-primary/10 text-primary border border-primary/60 hover:bg-primary/20 hover:shadow-[0_0_24px_-2px_var(--primary)]",
    violet:  "bg-accent/15 text-foreground border border-accent/60 hover:bg-accent/25 hover:shadow-[0_0_24px_-2px_var(--accent)]",
    ghost:   "bg-transparent text-foreground/80 border border-border hover:border-primary/50 hover:text-primary",
    danger:  "bg-destructive/10 text-destructive border border-destructive/60 hover:bg-destructive/20",
  };
  return (
    <button className={`${base} ${styles[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
