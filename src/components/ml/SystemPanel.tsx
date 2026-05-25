import type { ReactNode } from "react";

/** Etiqueta de origen del mensaje; no debe partirse en varias líneas. */
export function SystemLabel() {
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap text-neon font-display text-xs tracking-wider mt-0.5">
      (sistema)
    </span>
  );
}

export function SystemPanel({
  title,
  eyebrow,
  children,
  className = "",
  neon = false,
}: {
  title?: string;
  eyebrow?: string;
  children: ReactNode;
  className?: string;
  neon?: boolean;
}) {
  return (
    <section className={`panel ${neon ? "panel-neon" : ""} p-5 sm:p-6 ${className}`}>
      {(eyebrow || title) && (
        <header className="mb-4">
          {eyebrow && <div className="chip mb-2">{eyebrow}</div>}
          {title && <h2 className="text-xl sm:text-2xl font-display text-foreground">{title}</h2>}
          <div className="divider-neon mt-3" />
        </header>
      )}
      {children}
    </section>
  );
}

export function SystemMessage({ children }: { children: ReactNode }) {
  return (
    <div className="panel panel-neon p-4 flex items-start gap-3 scanline min-w-0">
      <SystemLabel />
      <div className="min-w-0 flex-1 text-sm text-foreground/90 leading-relaxed">{children}</div>
    </div>
  );
}
