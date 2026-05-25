import type { ReactNode } from "react";

type Tone = "neon" | "violet" | "success" | "warning" | "muted";

const TONE: Record<Tone, string> = {
  neon: "chip",
  violet: "chip chip-violet",
  success: "chip chip-success",
  warning: "chip chip-warning",
  muted: "chip",
};

export function Badge({
  tone = "neon", children, className = "",
}: { tone?: Tone; children: ReactNode; className?: string }) {
  return <span className={`${TONE[tone]} ${className}`}>{children}</span>;
}
