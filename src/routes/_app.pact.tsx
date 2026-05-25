import { createFileRoute } from "@tanstack/react-router";
import { SystemMessage } from "@/components/ml/SystemPanel";
import { NeonButton } from "@/components/ml/NeonButton";
import { Badge } from "@/components/ml/Badge";
import { useGame } from "@/lib/game/store";
import type { PactType } from "@/lib/game/types";

export const Route = createFileRoute("/_app/pact")({ component: Pact });

const OPTIONS: { id: PactType; code: string; title: string; mult: number; short: string; long: string }[] = [
  { id: "progresion", code: "A", title: "Aceptar progresión", mult: 1.10,
    short: "Subes el listón.",
    long: "Aceptas la subida saludable que recomienda el sistema. Máxima XP y afinidad." },
  { id: "mantener",   code: "B", title: "Mantener pacto", mult: 1.00,
    short: "Misma carga.",
    long: "Mantienes los mismos objetivos. Estable, sin penalización." },
  { id: "descarga",   code: "D", title: "Semana de descarga", mult: 0.90,
    short: "Recuperación autorizada.",
    long: "Bajada saludable por fatiga acumulada. Ligera reducción de XP." },
  { id: "reducir",    code: "C", title: "Reducir pacto", mult: 0.70,
    short: "Bajada voluntaria.",
    long: "Bajas objetivos sin que el sistema lo recomiende. XP reducido." },
];

function Pact() {
  const { state, setPact } = useGame();
  const last7 = state.history.slice(-7);
  const done = last7.filter((h) => h.completed).length;
  const rec: PactType = done >= 5 ? "progresion" : done >= 3 ? "mantener" : done > 0 ? "reducir" : "descarga";
  const recOption = OPTIONS.find((o) => o.id === rec)!;

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 animate-fade-in-up">
      <div>
        <div className="system-eyebrow">Weekly contract</div>
        <h1 className="font-display text-2xl mt-1">Pacto semanal</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Semana en curso · {done}/7 días completados
        </p>
      </div>

      <SystemMessage>
        El sistema recomienda <span className="text-neon font-display">{recOption.title}</span> según tu progresión saludable. Puedes aceptarla o elegir otro pacto.
      </SystemMessage>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {OPTIONS.map((o) => {
          const active = state.pact === o.id;
          const recommended = o.id === rec;
          const tone =
            o.mult > 1 ? "var(--success)"
          : o.mult === 1 ? "var(--primary)"
          : o.mult >= 0.9 ? "var(--warning)"
          : "var(--destructive)";
          return (
            <button key={o.id} type="button" onClick={() => setPact(o.id)}
              className={`text-left panel p-5 transition group relative ${active ? "panel-neon" : ""} ${recommended ? "ring-1 ring-[color:var(--success)]/40" : ""}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Opción {o.code}</div>
                  <div className="font-display text-base mt-1">{o.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{o.short}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-2xl leading-none" style={{ color: tone, textShadow: `0 0 14px ${tone}` }}>
                    x{o.mult.toFixed(2)}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Multiplicador</div>
                </div>
              </div>

              <p className="text-xs text-foreground/80 mt-3 leading-relaxed">{o.long}</p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {recommended && <Badge tone="success">✓ Recomendado por el sistema</Badge>}
                {active && <Badge tone="neon">Pacto activo</Badge>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <NeonButton onClick={() => setPact(rec)} variant="violet">
          ⚡ Aplicar recomendación ({recOption.title})
        </NeonButton>
      </div>
    </div>
  );
}
