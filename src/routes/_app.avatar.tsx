import { createFileRoute } from "@tanstack/react-router";
import { SystemPanel } from "@/components/ml/SystemPanel";
import { AvatarCard } from "@/components/ml/AvatarCard";
import { NeonButton } from "@/components/ml/NeonButton";
import { Badge } from "@/components/ml/Badge";
import { XPBar } from "@/components/ml/XPBar";
import { useGame } from "@/lib/game/store";
import { PHASE_LABEL, avatarPhase } from "@/lib/game/types";

export const Route = createFileRoute("/_app/avatar")({ component: AvatarView });

const PHRASES = [
  "",
  "Aún no te conozco. Demuéstrame quién eres.",
  "Empiezo a confiar en tu constancia.",
  "Tu disciplina habla por ti. Sigamos.",
  "Eres alguien en quien apoyarse. Lo aprecio.",
  "Has llegado lejos. Estoy orgulloso/a de ti.",
];

function AvatarView() {
  const { state, reset } = useGame();
  const a = state.avatar!;
  const phase = avatarPhase(state.affinity);
  const phrase = PHRASES[phase];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in-up">
      <div>
        <div className="system-eyebrow">Affinity Level</div>
        <h1 className="font-display text-2xl mt-1">Administrador/a del Sistema</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-5 sm:gap-6">
        <AvatarCard avatar={a} affinity={state.affinity} quote={phrase} />

        <div className="space-y-4">
          <SystemPanel eyebrow="Identidad" title={a.name} neon>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-sm">
              <dt className="text-muted-foreground">Estilo</dt><dd className="capitalize">{a.style.replace("_", " ")}</dd>
              <dt className="text-muted-foreground">Piel</dt><dd className="capitalize">{a.skinTone.replace("_", " ")}</dd>
              <dt className="text-muted-foreground">Pelo</dt><dd className="capitalize">{a.hairColor.replace("_", " ")} · {a.hairStyle.replace("_", " ")}</dd>
              <dt className="text-muted-foreground">Ojos</dt><dd className="capitalize">{a.eyeColor}</dd>
              <dt className="text-muted-foreground">Fase</dt><dd>{phase}/5 · {PHASE_LABEL[phase]}</dd>
            </dl>
          </SystemPanel>

          <SystemPanel eyebrow="Afinidad" title="Progreso de la relación">
            <XPBar value={state.affinity} max={100} tone="violet" label="Afinidad total" />
            <div className="grid grid-cols-5 gap-2 mt-4">
              {[1, 2, 3, 4, 5].map((p) => (
                <div key={p}
                  className={`aspect-square rounded-md grid place-items-center text-xs font-display transition
                    ${p <= phase ? "panel-neon text-neon" : "panel opacity-50 text-muted-foreground"}`}>
                  F{p}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Cada fase desbloquea una skin visual y una nueva forma de hablar contigo. Mantén tu constancia para conservar la fase.
            </p>
          </SystemPanel>

          <SystemPanel eyebrow="Equipamiento" title="Skins desbloqueables">
            <div className="flex flex-wrap gap-1.5">
              <Badge tone="muted">Skin base</Badge>
              <Badge tone={phase >= 2 ? "neon" : "muted"}>Fase Profesional</Badge>
              <Badge tone={phase >= 3 ? "violet" : "muted"}>Fase Compañero</Badge>
              <Badge tone={phase >= 4 ? "violet" : "muted"}>Fase Cercano</Badge>
              <Badge tone={phase >= 5 ? "success" : "muted"}>Fase Élite</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Más skins y reacciones próximamente.
            </p>
          </SystemPanel>

          <div className="flex justify-end">
            <NeonButton variant="danger" onClick={() => {
              if (confirm("¿Reiniciar todo el progreso?")) reset();
            }}>Reiniciar perfil</NeonButton>
          </div>
        </div>
      </div>
    </div>
  );
}
