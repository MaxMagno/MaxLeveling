import { createFileRoute, Link } from "@tanstack/react-router";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { NeonButton } from "@/components/ml/NeonButton";
import { XPBar, StatRing } from "@/components/ml/XPBar";
import { AvatarCard } from "@/components/ml/AvatarCard";
import { useGame } from "@/lib/game/store";
import {
  PACT_LABEL, PACT_MULTIPLIER, PHASE_LABEL, avatarPhase,
  nextLevelXp, rankFor, XP_THRESHOLDS,
} from "@/lib/game/types";

export const Route = createFileRoute("/_app/dashboard")({ component: Dashboard });

function avatarLine(affinity: number, completedToday: boolean, streak: number, name: string) {
  const phase = avatarPhase(affinity);
  if (completedToday) {
    if (phase >= 4) return `Buen trabajo. Cada día confirmas por qué confío en ti.`;
    if (phase >= 2) return `Misión registrada. Vas por el camino correcto.`;
    return `Confirmado. Sigue así y empezaré a creer en ti.`;
  }
  if (streak >= 3) return `Tu racha de ${streak} días sigue viva. Hoy también, ${name}.`;
  return `Aún no completaste la misión de hoy. El sistema te espera.`;
}

function Dashboard() {
  const { state } = useGame();
  const phase = avatarPhase(state.affinity);
  const xpPrev = XP_THRESHOLDS[state.level - 1] ?? 0;
  const xpNext = nextLevelXp(state.level);
  const xpInLevel = state.xp - xpPrev;
  const xpNeeded = xpNext - xpPrev;
  const completedToday = !!state.todayLog?.completed;
  const line = avatarLine(state.affinity, completedToday, state.streak, state.profile!.name);

  return (
    <div className="space-y-6">
      <SystemMessage>
        Bienvenido de vuelta, <strong className="text-foreground">{state.profile!.name}</strong>.
        Multiplicador semanal activo: <strong className="text-neon">x{PACT_MULTIPLIER[state.pact]}</strong> · {PACT_LABEL[state.pact]}.
      </SystemMessage>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <SystemPanel eyebrow={`Rango · ${rankFor(state.level)}`} title={`Nivel ${state.level}`} neon>
            <div className="space-y-5">
              <XPBar value={xpInLevel} max={xpNeeded} label={`XP · siguiente nivel (${state.xp} total)`} />
              <div className="grid grid-cols-3 gap-3">
                <StatRing value={state.streak} max={Math.max(7, state.streak)} label="Racha (días)" color="var(--warning)" />
                <StatRing value={state.affinity} label={`Afinidad · ${PHASE_LABEL[phase]}`} color="var(--accent)" />
                <StatRing value={state.history.filter(h => h.completed).length}
                  max={Math.max(7, state.history.length)} label="Misiones OK" color="var(--success)" />
              </div>
            </div>
          </SystemPanel>

          <SystemPanel eyebrow="Daily Quest" title="Misión de hoy">
            {completedToday ? (
              <div className="space-y-3">
                <div className="chip" style={{ background: "color-mix(in oklab, var(--success) 15%, transparent)", borderColor: "var(--success)", color: "var(--success)" }}>
                  ✓ Completada
                </div>
                <p className="text-sm text-muted-foreground">
                  Ganaste <span className="text-neon font-display">+{state.todayLog!.xpEarned} XP</span> y
                  <span className="text-violet font-display"> +{state.todayLog!.affinityEarned} afinidad</span>.
                </p>
                <Link to="/quest"><NeonButton variant="ghost">Ver detalles</NeonButton></Link>
              </div>
            ) : (
              <div className="space-y-4">
                <ul className="space-y-2 text-sm">
                  {state.exercises.map((e) => (
                    <li key={e.id} className="flex justify-between py-2 border-b border-border/60 last:border-0">
                      <span className="text-foreground/90">{e.name}</span>
                      <span className="text-muted-foreground">{e.target} {e.unit}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/quest"><NeonButton>⚔ Iniciar misión</NeonButton></Link>
              </div>
            )}
          </SystemPanel>

          {/* Stubs visuales */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StubCard to="/inventory" eyebrow="Inventario" title="Items" hint="Pase de descanso, Escudo, Bonus XP…" />
            <StubCard to="/events" eyebrow="Eventos" title="Activos" hint="Próximamente: misiones semanales" />
            <StubCard to="/checkin" eyebrow="Check-in" title="Mensual" hint="Peso y masa muscular cada mes" />
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 h-fit">
          <AvatarCard avatar={state.avatar!} affinity={state.affinity} />
          <SystemPanel eyebrow="Frase del avatar">
            <p className="text-sm italic text-foreground/90 leading-relaxed">"{line}"</p>
          </SystemPanel>
        </aside>
      </div>
    </div>
  );
}

function StubCard({ to, eyebrow, title, hint }: { to: string; eyebrow: string; title: string; hint: string }) {
  return (
    <Link to={to} className="panel p-4 hover:panel-neon transition block">
      <div className="chip mb-2">{eyebrow}</div>
      <div className="font-display text-lg">{title}</div>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </Link>
  );
}
