import { createFileRoute } from "@tanstack/react-router";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { useGame } from "@/lib/game/store";
import { PACT_LABEL, PACT_MULTIPLIER } from "@/lib/game/types";

export const Route = createFileRoute("/_app/history")({ component: History });

function History() {
  const { state } = useGame();
  const last30 = state.history.slice(-30);
  const completed = last30.filter((h) => h.completed).length;
  const failed = last30.filter((h) => h.failed && !h.completed).length;
  const xp = last30.reduce((a, h) => a + h.xpEarned, 0);
  const aff = last30.reduce((a, h) => a + h.affinityEarned, 0);
  const best = last30.reduce<(typeof last30)[number] | null>(
    (b, h) => (!b || h.xpEarned > b.xpEarned ? h : b),
    null,
  );

  return (
    <div className="space-y-6">
      <SystemMessage>
        Historial de tu progresión. Las semanas perfectas otorgan bonus de XP y afinidad.
      </SystemMessage>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Completados" value={completed} color="var(--success)" />
        <Stat label="Fallidos" value={failed} color="var(--destructive)" />
        <Stat label="XP total" value={xp} color="var(--primary)" />
        <Stat label="Afinidad" value={aff} color="var(--accent)" />
      </div>

      <SystemPanel
        eyebrow={`Pacto activo · ${PACT_LABEL[state.pact]} (x${PACT_MULTIPLIER[state.pact]})`}
        title="Últimos 30 días"
      >
        {last30.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aún no hay registros. Completa tu primera misión.
          </p>
        ) : (
          <ul className="divide-y divide-border/60">
            {[...last30].reverse().map((h) => (
              <li key={h.date} className="py-2.5 flex items-center justify-between text-sm">
                <span className="font-display text-xs text-muted-foreground">{h.date}</span>
                <span className="flex items-center gap-3">
                  {h.completed ? (
                    <span
                      className="chip"
                      style={{
                        background: "color-mix(in oklab, var(--success) 15%, transparent)",
                        borderColor: "var(--success)",
                        color: "var(--success)",
                      }}
                    >
                      ✓ Completado
                    </span>
                  ) : (
                    <span
                      className="chip"
                      style={{
                        background: "color-mix(in oklab, var(--destructive) 15%, transparent)",
                        borderColor: "var(--destructive)",
                        color: "var(--destructive)",
                      }}
                    >
                      ✗ Fallido
                    </span>
                  )}
                  <span className="text-neon font-display w-16 text-right">+{h.xpEarned} XP</span>
                </span>
              </li>
            ))}
          </ul>
        )}
        {best && best.completed && (
          <div className="mt-4 text-xs text-muted-foreground">
            Mejor día: <span className="text-foreground">{best.date}</span> con
            <span className="text-neon"> +{best.xpEarned} XP</span>.
          </div>
        )}
      </SystemPanel>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="panel p-4">
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-display text-2xl mt-1" style={{ color }}>
        {value}
      </div>
    </div>
  );
}
