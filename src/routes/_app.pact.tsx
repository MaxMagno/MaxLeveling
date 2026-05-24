import { createFileRoute } from "@tanstack/react-router";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { NeonButton } from "@/components/ml/NeonButton";
import { useGame } from "@/lib/game/store";
import type { PactType } from "@/lib/game/types";

export const Route = createFileRoute("/_app/pact")({ component: Pact });

const OPTIONS: { id: PactType; title: string; mult: string; desc: string; rec?: boolean }[] = [
  { id: "progresion", title: "A · Aceptar progresión recomendada", mult: "x1.10",
    desc: "Subes el esfuerzo de forma saludable. Recompensa máxima de XP y afinidad.", rec: true },
  { id: "mantener",   title: "B · Mantener pacto", mult: "x1.00",
    desc: "Mantienes los mismos objetivos. Estable, sin penalización." },
  { id: "reducir",    title: "C · Reducir pacto", mult: "x0.70",
    desc: "Bajas objetivos sin recomendación del sistema. XP reducido." },
  { id: "descarga",   title: "D · Semana de descarga", mult: "x0.90",
    desc: "Bajada saludable por fatiga o recuperación. XP ligeramente reducido." },
];

function Pact() {
  const { state, setPact } = useGame();
  // Recomendación: completados últimos 7 días
  const last7 = state.history.slice(-7);
  const done = last7.filter((h) => h.completed).length;
  const rec: PactType = done >= 5 ? "progresion" : done >= 3 ? "mantener" : done > 0 ? "reducir" : "descarga";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <SystemMessage>
        Cada semana eliges tu pacto. Si bajas la dificultad voluntariamente, no recibirás los
        mismos puntos que aceptando la progresión saludable.
      </SystemMessage>

      <SystemPanel eyebrow={`Semana actual · ${done}/7 días completados`}
        title="Pacto semanal" neon>
        <p className="text-xs text-muted-foreground mb-4">
          Recomendación del sistema: <span className="text-neon font-display">
            {OPTIONS.find(o => o.id === rec)?.title.split("·")[1]?.trim()}
          </span>
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {OPTIONS.map((o) => {
            const active = state.pact === o.id;
            return (
              <button key={o.id} type="button" onClick={() => setPact(o.id)}
                className={`text-left panel p-4 transition ${active ? "panel-neon" : ""}`}>
                <div className="flex items-center justify-between mb-1">
                  <div className="font-display text-sm">{o.title}</div>
                  <span className="chip">{o.mult}</span>
                </div>
                <p className="text-xs text-muted-foreground">{o.desc}</p>
                {o.id === rec && (
                  <div className="mt-2 text-[10px] uppercase tracking-widest text-[color:var(--success)]">
                    ✓ Recomendado
                  </div>
                )}
                {active && (
                  <div className="mt-2 text-[10px] uppercase tracking-widest text-neon">
                    Pacto activo
                  </div>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex justify-end mt-5">
          <NeonButton onClick={() => setPact(rec)} variant="violet">
            Aplicar recomendación ({OPTIONS.find(o => o.id === rec)?.title.split("·")[1]?.trim()})
          </NeonButton>
        </div>
      </SystemPanel>
    </div>
  );
}
