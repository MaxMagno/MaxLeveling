import type { AvatarProfile } from "@/lib/game/types";
import { PHASE_LABEL, avatarPhase } from "@/lib/game/types";

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

export function AvatarCard({ avatar, affinity = 0, compact = false }:
{ avatar: AvatarProfile; affinity?: number; compact?: boolean }) {
  const phase = avatarPhase(affinity);
  const skin = SKIN[avatar.skinTone];
  const hair = HAIR[avatar.hairColor];
  const eye = EYE[avatar.eyeColor];
  const size = compact ? 120 : 200;

  return (
    <div className={`panel panel-neon p-5 ${compact ? "" : "min-h-[320px]"}`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="chip">Admin del Sistema · Fase {phase}</div>
          <h3 className="font-display text-lg mt-2">{avatar.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {avatar.style.replace("_", " ")} · {PHASE_LABEL[phase]}
          </p>
        </div>
      </div>

      <div className="grid place-items-center my-2">
        <svg viewBox="0 0 200 220" width={size} height={size * 1.1}
          style={{ filter: "drop-shadow(0 0 18px var(--primary))" }}>
          {/* halo */}
          <circle cx="100" cy="100" r="92" fill="none"
            stroke="var(--primary)" strokeOpacity="0.25" strokeWidth="1" />
          <circle cx="100" cy="100" r="78" fill="none"
            stroke="var(--accent)" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 5" />
          {/* shoulders / outfit */}
          <path d={`M 35 215 Q 100 ${150 + phase * 4} 165 215 L 165 230 L 35 230 Z`}
            fill="var(--accent)" opacity={0.25 + phase * 0.1} />
          <path d="M 60 175 Q 100 150 140 175 L 140 215 L 60 215 Z"
            fill="oklch(0.25 0.06 270)" stroke="var(--primary)" strokeOpacity="0.5" />
          {/* neck */}
          <rect x="90" y="125" width="20" height="22" fill={skin} />
          {/* head */}
          <ellipse cx="100" cy="100" rx="38" ry="44" fill={skin} />
          {/* hair */}
          <path d="M 62 95 Q 60 55 100 50 Q 140 55 138 95 Q 135 75 100 72 Q 65 75 62 95 Z"
            fill={hair} />
          <path d="M 62 95 Q 55 130 65 145 L 70 110 Z" fill={hair} opacity="0.85" />
          <path d="M 138 95 Q 145 130 135 145 L 130 110 Z" fill={hair} opacity="0.85" />
          {/* eyes */}
          <ellipse cx="86" cy="103" rx="4" ry="5" fill={eye} />
          <ellipse cx="114" cy="103" rx="4" ry="5" fill={eye} />
          <circle cx="87" cy="102" r="1.3" fill="#fff" />
          <circle cx="115" cy="102" r="1.3" fill="#fff" />
          {/* mouth */}
          <path d="M 92 120 Q 100 124 108 120" stroke="#8a3a3a" strokeWidth="1.5" fill="none" />
        </svg>
      </div>

      {!compact && (
        <div className="grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-widest text-muted-foreground">
          <div><div className="text-foreground">{affinity}</div>Afinidad</div>
          <div><div className="text-foreground">{phase}/5</div>Fase</div>
          <div><div className="text-foreground capitalize">{avatar.hairStyle.replace("_", " ")}</div>Estilo</div>
        </div>
      )}
    </div>
  );
}
