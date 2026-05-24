import type { ReactNode } from "react";

export function SystemPanel({
  title, eyebrow, children, className = "", neon = false,
}: { title?: string; eyebrow?: string; children: ReactNode; className?: string; neon?: boolean }) {
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
    <div className="panel panel-neon p-4 flex items-start gap-3 scanline">
      <span className="text-neon font-display text-xs tracking-widest mt-0.5">[ SISTEMA ]</span>
      <p className="text-sm text-foreground/90 leading-relaxed">{children}</p>
    </div>
  );
}
