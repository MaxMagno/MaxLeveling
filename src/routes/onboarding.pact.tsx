import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { NeonButton } from "@/components/ml/NeonButton";
import { useGame } from "@/lib/game/store";
import { Badge } from "@/components/ml/Badge";
import { OnboardingProgress } from "@/components/ml/OnboardingProgress";
import {
  PACT_LABEL, PACT_MULTIPLIER, RECOMMENDED_PACT_INITIAL,
  onboardingStepLabel,
  type PactType,
} from "@/lib/game/types";

export const Route = createFileRoute("/onboarding/pact")({ component: PactStep });

const OPTIONS: { id: PactType; title: string; mult: string; desc: string }[] = [
  { id: "progresion", title: "A · Progresión recomendada", mult: "x1.10",
    desc: "El sistema recomienda avanzar de forma saludable esta semana." },
  { id: "mantener",   title: "B · Mantener pacto", mult: "x1.00",
    desc: "Mismos objetivos. Estable, sin penalización." },
  { id: "reducir",    title: "C · Reducir pacto", mult: "x0.70",
    desc: "Bajas objetivos voluntariamente. XP reducido." },
  { id: "descarga",   title: "D · Semana de descarga", mult: "x0.90",
    desc: "Bajada saludable por fatiga o recuperación." },
];

function PactStep() {
  const { state, setPact } = useGame();
  const nav = useNavigate();
  const [sel, setSel] = useState<PactType>(RECOMMENDED_PACT_INITIAL);
  const recommended = RECOMMENDED_PACT_INITIAL;
  if (!state.profile) return <Navigate to="/onboarding/profile" />;
  if (!state.avatar) return <Navigate to="/onboarding/avatar" />;

  const confirm = () => {
    setPact(sel);
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-14 relative z-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <div className="chip mx-auto">{onboardingStepLabel(3)}</div>
          <OnboardingProgress step={3} />
          <h1 className="font-display text-3xl sm:text-4xl">Pacto semanal inicial</h1>
          <p className="text-sm text-muted-foreground">
            Elige el ritmo con el que quieres empezar. Podrás revisarlo cada semana.
          </p>
        </header>

        <SystemMessage>
          Recomendación inicial: <span className="text-neon">{PACT_LABEL[recommended]}</span>
          {" "}(x{PACT_MULTIPLIER[recommended]}). El sistema recomienda avanzar de forma saludable esta semana.
        </SystemMessage>

        <SystemPanel eyebrow="Selecciona tu pacto" title="¿Cómo afrontas esta semana?" neon>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {OPTIONS.map((o) => {
              const active = sel === o.id;
              const isRecommended = o.id === recommended;
              return (
                <button key={o.id} type="button" onClick={() => setSel(o.id)}
                  className={`text-left panel p-4 transition ${active ? "panel-neon" : ""} ${isRecommended ? "ring-1 ring-[color:var(--success)]/40" : ""}`}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-display text-sm">{o.title}</div>
                    <span className="chip">{o.mult}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{o.desc}</p>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {isRecommended && <Badge tone="success">✓ Recomendado por el sistema</Badge>}
                    {active && <Badge tone="neon">Pacto seleccionado</Badge>}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-5">
            <button type="button" onClick={() => nav({ to: "/onboarding/avatar" })}
              className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">
              ← Volver
            </button>
            <NeonButton onClick={confirm} variant="violet">⚡ Iniciar sistema</NeonButton>
          </div>
        </SystemPanel>
      </div>
    </div>
  );
}
