export function XPBar({
  value, max, label, tone = "primary", shimmer = false,
}: { value: number; max: number; label?: string; tone?: "primary" | "violet" | "success"; shimmer?: boolean }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  const grad =
    tone === "violet"  ? "linear-gradient(90deg, var(--accent), var(--primary))"
  : tone === "success" ? "linear-gradient(90deg, var(--success), var(--primary))"
  :                      "linear-gradient(90deg, var(--primary), var(--accent))";
  const glow =
    tone === "violet"  ? "var(--accent)"
  : tone === "success" ? "var(--success)"
  :                      "var(--primary)";
  return (
    <div className="space-y-1.5">
      {label && (
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-muted-foreground tracking-widest uppercase">{label}</span>
          <span className="text-neon font-display">{value} / {max}</span>
        </div>
      )}
      <div className="h-2.5 rounded-full bg-input/60 overflow-hidden border border-border/70">
        <div
          className={`h-full rounded-full transition-all duration-700 ${shimmer ? "bar-shimmer" : ""}`}
          style={{
            width: `${pct}%`,
            background: grad,
            boxShadow: `0 0 18px -2px ${glow}`,
          }}
        />
      </div>
    </div>
  );
}

export function StatRing({ value, max = 100, label, color = "var(--accent)" }:
{ value: number; max?: number; label: string; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="flex items-center gap-3">
      <div className="relative w-14 h-14">
        <svg viewBox="0 0 36 36" className="w-14 h-14 -rotate-90">
          <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--input)" strokeWidth="2.5" />
          <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="2.5"
            strokeDasharray={`${pct}, 100`} strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        </svg>
        <span className="absolute inset-0 grid place-items-center text-xs font-display">{value}</span>
      </div>
      <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
    </div>
  );
}

/** Streak counter destacado tipo "X DÍAS". */
export function StreakBadge({ streak, best }: { streak: number; best?: number }) {
  const hot = streak >= 3;
  return (
    <div className={`panel p-4 ${hot ? "panel-violet" : ""}`}>
      <div className="system-eyebrow">Racha</div>
      <div className="mt-2 flex items-end gap-2">
        <span
          className="font-display text-4xl leading-none"
          style={{
            color: hot ? "var(--warning)" : "var(--foreground)",
            textShadow: hot ? "0 0 18px color-mix(in oklab, var(--warning) 60%, transparent)" : undefined,
          }}
        >
          {streak}
        </span>
        <span className="text-xs uppercase tracking-widest text-muted-foreground pb-1">
          {streak === 1 ? "día" : "días"}
        </span>
        <span className="ml-auto text-[10px] uppercase tracking-widest text-muted-foreground pb-1">
          Récord <span className="text-foreground">{best ?? streak}</span>
        </span>
      </div>
    </div>
  );
}
