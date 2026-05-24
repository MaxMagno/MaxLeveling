import { createFileRoute } from "@tanstack/react-router";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";

export const Route = createFileRoute("/_app/events")({ component: Events });

const STUB = [
  { name: "Despertar de cazador", desc: "Completa misión 3 días seguidos.", reward: "1 Pase de descanso", progress: 1, target: 3 },
  { name: "Cazador constante", desc: "Completa 5 días de misión en una semana.", reward: "1 Escudo de racha", progress: 2, target: 5 },
  { name: "Núcleo estable", desc: "Plancha 3 días seguidos.", reward: "1 Multiplicador de afinidad", progress: 0, target: 3 },
];

function Events() {
  return (
    <div className="space-y-6">
      <SystemMessage>
        Eventos · Vista previa. Pronto se desbloquearán recompensas reales.
      </SystemMessage>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STUB.map((e) => {
          const pct = Math.round((e.progress / e.target) * 100);
          return (
            <SystemPanel key={e.name} eyebrow="Activo" title={e.name}>
              <p className="text-sm text-muted-foreground mb-3">{e.desc}</p>
              <div className="h-2 rounded-full bg-input/60 overflow-hidden mb-2">
                <div className="h-full" style={{
                  width: `${pct}%`,
                  background: "linear-gradient(90deg, var(--primary), var(--accent))",
                }} />
              </div>
              <div className="text-xs text-muted-foreground flex justify-between">
                <span>{e.progress}/{e.target}</span>
                <span className="text-neon">{e.reward}</span>
              </div>
            </SystemPanel>
          );
        })}
      </div>
    </div>
  );
}
