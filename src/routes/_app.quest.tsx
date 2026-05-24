import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { NeonButton } from "@/components/ml/NeonButton";
import { TextInput } from "@/components/ml/Field";
import { useGame } from "@/lib/game/store";
import { PACT_LABEL, PACT_MULTIPLIER } from "@/lib/game/types";

export const Route = createFileRoute("/_app/quest")({ component: Quest });

function Quest() {
  const { state, submitDaily } = useGame();
  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(state.exercises.map((e) => [e.id, state.todayLog?.values[e.id] ?? 0])));
  const [done, setDone] = useState(state.todayLog ?? null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const log = submitDaily(vals);
    setDone(log);
  };

  const avg = state.exercises.reduce(
    (acc, ex) => acc + (Number(vals[ex.id] ?? 0) / ex.target), 0,
  ) / state.exercises.length;
  const completedPreview = state.exercises.every((ex) => Number(vals[ex.id] ?? 0) >= ex.target);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SystemMessage>
        Registra cuánto has hecho realmente en cada ejercicio. El sistema valida la misión y
        calcula XP, bonus y afinidad.
      </SystemMessage>

      <SystemPanel eyebrow={`Pacto · ${PACT_LABEL[state.pact]} (x${PACT_MULTIPLIER[state.pact]})`}
        title="Daily Quest" neon>
        <form onSubmit={onSubmit} className="space-y-4">
          {state.exercises.map((ex) => {
            const v = Number(vals[ex.id] ?? 0);
            const pct = Math.min(100, Math.round((v / ex.target) * 100));
            return (
              <div key={ex.id} className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="font-display text-sm">{ex.name}</span>
                  <span className="text-xs text-muted-foreground">
                    objetivo: <span className="text-foreground">{ex.target} {ex.unit}</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <TextInput type="number" min={0} value={v}
                    onChange={(e) =>
                      setVals((s) => ({ ...s, [ex.id]: Number(e.target.value) }))}
                    className="w-28" />
                  <div className="flex-1 h-2 rounded-full bg-input/60 overflow-hidden">
                    <div className="h-full transition-all"
                      style={{
                        width: `${pct}%`,
                        background: pct >= 100
                          ? "linear-gradient(90deg, var(--success), var(--primary))"
                          : "linear-gradient(90deg, var(--primary), var(--accent))",
                      }} />
                  </div>
                  <span className="w-10 text-right text-xs text-muted-foreground">{pct}%</span>
                </div>
              </div>
            );
          })}

          <div className="divider-neon" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-muted-foreground">
              Estado: {completedPreview
                ? <span className="text-[color:var(--success)] font-display">MISIÓN MÍNIMA OK · esfuerzo medio {Math.round(avg * 100)}%</span>
                : <span className="text-warning font-display">Pendiente</span>}
            </div>
            <NeonButton type="submit" variant={completedPreview ? "primary" : "ghost"}>
              ⚡ Registrar y completar
            </NeonButton>
          </div>
        </form>
      </SystemPanel>

      {done && (
        <SystemPanel eyebrow="Resultado" title={done.completed ? "Misión completada" : "Misión fallida"}>
          {done.completed ? (
            <p className="text-sm">
              Ganaste <span className="text-neon font-display">+{done.xpEarned} XP</span> y
              <span className="text-violet font-display"> +{done.affinityEarned} afinidad</span>.
              Racha actual: <strong>{state.streak}</strong> días.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Hoy no se cumplió el mínimo. Sin XP, sin racha. El avatar responde con frialdad.
            </p>
          )}
        </SystemPanel>
      )}
    </div>
  );
}
