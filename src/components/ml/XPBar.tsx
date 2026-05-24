export function XPBar({ value, max, label }: { value: number; max: number; label?: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <span className="text-muted-foreground tracking-widest uppercase">{label ?? "XP"}</span>
        <span className="text-neon font-display">{value} / {max}</span>
      </div>
      <div className="h-2 rounded-full bg-input/60 overflow-hidden border border-border">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, var(--primary), var(--accent))",
            boxShadow: "0 0 16px -2px var(--primary)",
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
