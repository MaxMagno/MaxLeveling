import { createFileRoute } from "@tanstack/react-router";
import { SystemPanel } from "@/components/ml/SystemPanel";
import { AvatarCard } from "@/components/ml/AvatarCard";
import { NeonButton } from "@/components/ml/NeonButton";
import { useGame } from "@/lib/game/store";
import { PHASE_LABEL, avatarPhase } from "@/lib/game/types";

export const Route = createFileRoute("/_app/avatar")({ component: AvatarView });

function AvatarView() {
  const { state, reset } = useGame();
  const a = state.avatar!;
  const phase = avatarPhase(state.affinity);
  const nextThresh = [20, 40, 60, 80, 100][phase - 1] ?? 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
      <AvatarCard avatar={a} affinity={state.affinity} />

      <div className="space-y-4">
        <SystemPanel eyebrow="Administrador/a del Sistema" title={a.name} neon>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Estilo</dt><dd className="capitalize">{a.style.replace("_", " ")}</dd>
            <dt className="text-muted-foreground">Piel</dt><dd className="capitalize">{a.skinTone.replace("_", " ")}</dd>
            <dt className="text-muted-foreground">Pelo</dt><dd className="capitalize">{a.hairColor.replace("_", " ")} · {a.hairStyle.replace("_", " ")}</dd>
            <dt className="text-muted-foreground">Ojos</dt><dd className="capitalize">{a.eyeColor}</dd>
            <dt className="text-muted-foreground">Fase</dt><dd>{phase}/5 · {PHASE_LABEL[phase]}</dd>
            <dt className="text-muted-foreground">Afinidad</dt><dd>{state.affinity}/100 (próxima fase: {nextThresh})</dd>
          </dl>
        </SystemPanel>

        <SystemPanel eyebrow="Skins" title="Desbloqueables">
          <div className="grid grid-cols-5 gap-2">
            {[1,2,3,4,5].map((p) => (
              <div key={p} className={`aspect-square rounded-md grid place-items-center text-xs font-display
                ${p <= phase ? "panel-neon text-neon" : "panel opacity-50 text-muted-foreground"}`}>
                F{p}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Mantén tu afinidad alta para conservar la fase actual. Cada fase desbloquea una skin visual.
          </p>
        </SystemPanel>

        <div className="flex justify-end">
          <NeonButton variant="danger" onClick={() => {
            if (confirm("¿Reiniciar todo el progreso?")) reset();
          }}>Reiniciar perfil</NeonButton>
        </div>
      </div>
    </div>
  );
}
