import type { AvatarProfile } from "@/lib/game/types";
import { PHASE_LABEL, avatarPhase } from "@/lib/game/types";
import { XPBar } from "./XPBar";

const SKIN: Record<string, string> = {
  muy_clara: "#f4d9c4", clara: "#e6bfa0", media: "#c08e6a",
  morena: "#8c5a3a", oscura: "#4a2a1a",
};
const HAIR: Record<string, string> = {
  negro: "#0c0c12", castano_oscuro: "#3a2418", castano_claro: "#7a4e2c",
  rubio: "#e6c87a", pelirrojo: "#c04a2a", blanco_plata: "#dfe7f0",
  azul_oscuro: "#1e3a6e", violeta: "#7c3aed",
};
const EYE: Record<string, string> = {
  marron: "#6b3a1a", azul: "#3aa0ff", verde: "#34d39a", gris: "#9aa3b2",
  violeta: "#a78bfa", ambar: "#f59e0b",
};

const PHASE_THRESH = [20, 40, 60, 80, 100];

export function AvatarCard({
  avatar, affinity = 0, quote, compact = false,
}: { avatar: AvatarProfile; affinity?: number; quote?: string; compact?: boolean }) {
  const phase = avatarPhase(affinity);
  const skin = SKIN[avatar.skinTone];
  const hair = HAIR[avatar.hairColor];
  const eye = EYE[avatar.eyeColor];
  const size = compact ? 110 : 200;
  const prevThresh = phase === 1 ? 0 : PHASE_THRESH[phase - 2];
  const nextThresh = PHASE_THRESH[phase - 1] ?? 100;
  const inPhase = affinity - prevThresh;
  const phaseSize = nextThresh - prevThresh;

  return (
    <div className="panel panel-violet p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="system-eyebrow">Affinity Level · F{phase}/5</div>
          <h3 className="font-display text-lg mt-2 leading-tight">{avatar.name}</h3>
          <p className="text-xs text-muted-foreground capitalize mt-0.5">
            {PHASE_LABEL[phase]} · admin del sistema
          </p>
        </div>
        <span className="chip chip-violet">{affinity}/100</span>
      </div>

      <div className="grid place-items-center">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full blur-2xl opacity-40 -z-0"
            style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
          />
          <svg viewBox="0 0 200 220" width={size} height={size * 1.1} className="relative"
            style={{ filter: "drop-shadow(0 0 22px var(--primary))" }}>
            <circle cx="100" cy="100" r="92" fill="none"
              stroke="var(--primary)" strokeOpacity="0.25" strokeWidth="1" />
            <circle cx="100" cy="100" r="78" fill="none"
              stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 5" />
            <path d={`M 35 215 Q 100 ${150 + phase * 4} 165 215 L 165 230 L 35 230 Z`}
              fill="var(--accent)" opacity={0.25 + phase * 0.1} />
            <path d="M 60 175 Q 100 150 140 175 L 140 215 L 60 215 Z"
              fill="oklch(0.25 0.06 270)" stroke="var(--primary)" strokeOpacity="0.5" />
            <rect x="90" y="125" width="20" height="22" fill={skin} />
            <ellipse cx="100" cy="100" rx="38" ry="44" fill={skin} />
            <path d="M 62 95 Q 60 55 100 50 Q 140 55 138 95 Q 135 75 100 72 Q 65 75 62 95 Z"
              fill={hair} />
            <path d="M 62 95 Q 55 130 65 145 L 70 110 Z" fill={hair} opacity="0.85" />
            <path d="M 138 95 Q 145 130 135 145 L 130 110 Z" fill={hair} opacity="0.85" />
            <ellipse cx="86" cy="103" rx="4" ry="5" fill={eye} />
            <ellipse cx="114" cy="103" rx="4" ry="5" fill={eye} />
            <circle cx="87" cy="102" r="1.3" fill="#fff" />
            <circle cx="115" cy="102" r="1.3" fill="#fff" />
            <path d="M 92 120 Q 100 124 108 120" stroke="#8a3a3a" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>

      <XPBar value={inPhase} max={phaseSize} tone="violet" label={`Fase ${phase} → ${phase + 1}`} />

      {quote && !compact && (
        <div className="panel p-3 scanline">
          <div className="text-[10px] uppercase tracking-widest text-violet mb-1">{avatar.name}</div>
          <p className="text-sm italic text-foreground/90 leading-snug">"{quote}"</p>
        </div>
      )}

      {!compact && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          <span className="chip">{avatar.style.replace("_", " ")}</span>
          <span className="chip">{avatar.hairColor.replace("_", " ")}</span>
          <span className="chip">ojos {avatar.eyeColor}</span>
        </div>
      )}
    </div>
  );
}
