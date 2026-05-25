import { createFileRoute, Link } from "@tanstack/react-router";
import { SystemPanel } from "@/components/ml/SystemPanel";
import { NeonButton } from "@/components/ml/NeonButton";
import { XPBar, StreakBadge } from "@/components/ml/XPBar";
import { Badge } from "@/components/ml/Badge";
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
    if (phase >= 4) return `Buen trabajo, ${name}. Cada día confirmas por qué confío en ti.`;
    if (phase >= 2) return `Misión registrada. Vas por el camino correcto.`;
    return `Confirmado. Sigue así y empezaré a creer en ti.`;
  }
  if (streak >= 3) return `Tu racha de ${streak} días sigue viva. Hoy también, ${name}.`;
  return `Misión diaria activada. El sistema te espera.`;
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
  const mult = PACT_MULTIPLIER[state.pact];

  return (
    <div className="space-y-5 sm:space-y-6 animate-fade-in-up">
      {/* HUD superior */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="system-eyebrow">Player Status</div>
          <h1 className="font-display text-xl sm:text-2xl mt-1">
            Cazador <span className="text-neon">{state.profile!.name}</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            {rankFor(state.level)} · Nivel {state.level}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Badge tone="success">● System online</Badge>
          <Badge tone={completedToday ? "success" : "warning"}>
            {completedToday ? "Misión completada" : "Misión activa"}
          </Badge>
          <Badge tone="violet">Pacto x{mult}</Badge>
        </div>
      </div>

      {/* Grid principal: en móvil quest primero, avatar después */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 sm:gap-6">
        <div className="space-y-5 sm:space-y-6 order-1">

          {/* DAILY QUEST – bloque hero */}
          <section className="panel panel-neon p-5 sm:p-6 relative overflow-hidden">
            <div
              className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-40 pointer-events-none"
              style={{ background: "radial-gradient(circle, var(--primary), transparent 70%)" }}
            />
            <div className="relative">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="system-eyebrow">Daily Quest activated</div>
                {completedToday ? (
                  <Badge tone="success">✓ Completada</Badge>
                ) : (
                  <Badge tone="warning">Pendiente</Badge>
                )}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-foreground leading-tight">
                Misión de hoy
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {state.exercises.length} ejercicios · multiplicador semanal x{mult} ({PACT_LABEL[state.pact]})
              </p>

              <div className="divider-neon my-4" />

              {completedToday ? (
                <div className="space-y-3">
                  <p className="text-sm">
                    Ganaste <span className="text-neon font-display">+{state.todayLog!.xpEarned} XP</span> y
                    <span className="text-violet font-display"> +{state.todayLog!.affinityEarned} afinidad</span>.
                  </p>
                  <Link to="/quest"><NeonButton variant="ghost">Ver detalle de la misión</NeonButton></Link>
                </div>
              ) : (
                <>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {state.exercises.map((e) => (
                      <li key={e.id} className="panel p-3 flex items-center justify-between">
                        <span className="text-sm text-foreground/90">{e.name}</span>
                        <span className="text-xs font-display text-neon">{e.target} {e.unit}</span>
                      </li>
                    ))}
                  </ul>
                  <Link to="/quest"><NeonButton className="w-full sm:w-auto">⚔ Iniciar misión</NeonButton></Link>
                </>
              )}
            </div>
          </section>

          {/* STATS: XP + Racha + Afinidad */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="panel p-4 sm:col-span-2">
              <div className="flex items-baseline justify-between mb-2">
                <div className="system-eyebrow">XP · siguiente nivel</div>
                <div className="text-xs text-muted-foreground">
                  Nv. <span className="text-neon font-display">{state.level}</span>
                  <span className="mx-1">→</span>
                  <span className="font-display">{state.level + 1}</span>
                </div>
              </div>
              <XPBar value={xpInLevel} max={xpNeeded} shimmer />
              <div className="mt-2 text-[11px] text-muted-foreground">
                Total acumulado <span className="text-foreground font-display">{state.xp} XP</span>
              </div>
            </div>
            <StreakBadge streak={state.streak} best={state.bestStreak} />
          </section>

          <section className="panel p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="system-eyebrow">Affinity Level</div>
              <Badge tone="violet">Fase {phase} · {PHASE_LABEL[phase]}</Badge>
            </div>
            <XPBar value={state.affinity} max={100} tone="violet" />
            <p className="text-[11px] text-muted-foreground mt-2">
              La afinidad evoluciona la relación con tu administrador/a del sistema.
            </p>
          </section>

          {/* Pacto + stubs */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link to="/pact" className="panel p-4 hover:panel-neon transition block sm:col-span-1">
              <div className="system-eyebrow">Weekly contract</div>
              <div className="font-display text-base mt-2">{PACT_LABEL[state.pact]}</div>
              <div className="text-xs text-muted-foreground mt-1">Multiplicador x{mult}</div>
            </Link>
            <StubCard to="/inventory" eyebrow="Inventario" title="Items" hint="Pase de descanso, escudo…" soon />
            <StubCard to="/events" eyebrow="Eventos" title="Activos" hint="Misiones semanales" soon />
          </section>
        </div>

        {/* Sidebar avatar */}
        <aside className="space-y-4 lg:sticky lg:top-20 h-fit order-2">
          <AvatarCard avatar={state.avatar!} affinity={state.affinity} quote={line} />
          <Link to="/checkin" className="panel p-4 hover:panel-neon transition block">
            <div className="flex items-center justify-between">
              <div>
                <div className="system-eyebrow">Check-in</div>
                <div className="font-display text-sm mt-1">Mensual</div>
              </div>
              <Badge tone="muted">Próximamente</Badge>
            </div>
          </Link>
        </aside>
      </div>
    </div>
  );
}

function StubCard({ to, eyebrow, title, hint, soon = false }:
{ to: string; eyebrow: string; title: string; hint: string; soon?: boolean }) {
  return (
    <Link to={to} className="panel p-4 hover:panel-neon transition block">
      <div className="flex items-center justify-between">
        <div className="system-eyebrow">{eyebrow}</div>
        {soon && <Badge tone="muted">Soon</Badge>}
      </div>
      <div className="font-display text-base mt-2">{title}</div>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
    </Link>
  );
}
