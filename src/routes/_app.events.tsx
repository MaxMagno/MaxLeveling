import { createFileRoute } from "@tanstack/react-router";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { Badge } from "@/components/ml/Badge";
import { useGame } from "@/lib/game/store";
import { eventRewardLabel } from "@/lib/game/mock";

export const Route = createFileRoute("/_app/events")({ component: Events });

function Events() {
  const { state } = useGame();
  const activeCount = state.events.filter((e) => e.status === "active").length;

  return (
    <div className="space-y-6">
      <SystemMessage>
        Eventos semanales activos. El progreso se actualiza al registrar tu misión diaria.
        {activeCount > 0 && (
          <> · <span className="text-neon">{activeCount} en curso</span></>
        )}
      </SystemMessage>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.events.map((e) => {
          const pct = Math.round((e.progress / e.target) * 100);
          const done = e.status === "completed";
          return (
            <SystemPanel
              key={e.id}
              eyebrow={done ? "Completado" : "Activo"}
              title={e.name}
            >
              <p className="text-sm text-muted-foreground mb-3">{e.description}</p>
              <div className="h-2 rounded-full bg-input/60 overflow-hidden mb-2">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, pct)}%`,
                    background: done
                      ? "linear-gradient(90deg, var(--success), var(--primary))"
                      : "linear-gradient(90deg, var(--primary), var(--accent))",
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground flex justify-between items-center gap-2">
                <span>
                  {Math.min(e.progress, e.target)}/{e.target}
                </span>
                <span className="text-neon">{eventRewardLabel(e)}</span>
              </div>
              {done && (
                <div className="mt-2">
                  <Badge tone="success">Recompensa obtenida</Badge>
                </div>
              )}
            </SystemPanel>
          );
        })}
      </div>
    </div>
  );
}
