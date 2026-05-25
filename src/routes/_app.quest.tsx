import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AvatarQuote } from "@/components/ml/AvatarQuote";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { ActiveEffectsBar } from "@/components/ml/ActiveEffectsBar";
import { NeonButton } from "@/components/ml/NeonButton";
import { Badge } from "@/components/ml/Badge";
import { TextInput } from "@/components/ml/Field";
import {
  getAvatarMessage, isStreakMilestone, type AvatarActionType,
} from "@/lib/game/avatarMessages";
import { useGame } from "@/lib/game/store";
import {
  PACT_LABEL, PACT_MULTIPLIER, type EventCompletionNotice, type Exercise,
} from "@/lib/game/types";

export const Route = createFileRoute("/_app/quest")({ component: Quest });

function statusOf(v: number, target: number) {
  if (v <= 0) return "pending" as const;
  if (v >= target * 1.25) return "bonus" as const;
  if (v >= target) return "done" as const;
  return "progress" as const;
}

function ExerciseCard({
  ex, value, onChange,
}: { ex: Exercise; value: number; onChange: (n: number) => void }) {
  const target = ex.target;
  const pct = Math.min(150, Math.round((value / target) * 100));
  const st = statusOf(value, target);
  const tone =
    st === "bonus" ? "violet"
  : st === "done"  ? "success"
  : st === "progress" ? "warning"
  : "muted";
  const label =
    st === "bonus" ? "+25% Bonus"
  : st === "done"  ? "Objetivo OK"
  : st === "progress" ? "En curso"
  : "Pendiente";

  return (
    <div className={`panel p-4 transition ${st === "bonus" ? "panel-violet" : st === "done" ? "panel-success" : ""}`}>
      <div className="flex items-start justify-between gap-2 mb-3">
        <div>
          <div className="font-display text-sm">{ex.name}</div>
          <div className="text-[11px] uppercase tracking-widest text-muted-foreground mt-0.5">
            Objetivo · <span className="text-foreground">{target} {ex.unit}</span>
          </div>
        </div>
        <Badge tone={tone}>{label}</Badge>
      </div>

      <div className="flex items-center gap-2">
        <button type="button" onClick={() => onChange(Math.max(0, value - 1))}
          className="w-9 h-9 rounded-md border border-border text-foreground/80 hover:text-primary hover:border-primary/60 text-lg leading-none">−</button>
        <TextInput type="number" inputMode="numeric" min={0} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 text-center text-base h-10" />
        <button type="button" onClick={() => onChange(value + 1)}
          className="w-9 h-9 rounded-md border border-border text-foreground/80 hover:text-primary hover:border-primary/60 text-lg leading-none">+</button>
        <span className="ml-1 text-xs uppercase tracking-widest text-muted-foreground w-10 text-right">{ex.unit}</span>
      </div>

      <div className="mt-3 h-2 rounded-full bg-input/60 overflow-hidden">
        <div className="h-full transition-all duration-500"
          style={{
            width: `${Math.min(100, pct)}%`,
            background: st === "bonus"
              ? "linear-gradient(90deg, var(--accent), var(--primary))"
              : st === "done"
              ? "linear-gradient(90deg, var(--success), var(--primary))"
              : "linear-gradient(90deg, var(--primary), var(--accent))",
            boxShadow: st === "done" || st === "bonus"
              ? "0 0 14px -2px var(--primary)" : undefined,
          }} />
      </div>
      <div className="mt-1 text-right text-[11px] text-muted-foreground">{pct}%</div>
    </div>
  );
}

function Quest() {
  const { state, submitDaily } = useGame();
  const [vals, setVals] = useState<Record<string, number>>(() =>
    Object.fromEntries(state.exercises.map((e) => [e.id, state.todayLog?.values[e.id] ?? 0])));
  const [done, setDone] = useState(state.todayLog ?? null);
  const [eventCompletions, setEventCompletions] = useState<EventCompletionNotice[]>([]);
  const [itemMessages, setItemMessages] = useState<string[]>([]);
  const [avatarQuote, setAvatarQuote] = useState<string | null>(null);

  const restDay = !!state.todayLog?.restAuthorized;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { log, eventCompletions: completions, itemMessages: msgs } = submitDaily(vals);
    setDone(log);
    setEventCompletions(completions);
    setItemMessages(msgs);

    let action: AvatarActionType = "mission_failed";
    if (log.restAuthorized) action = "rest_pass_used";
    else if (log.completed) {
      action = (log.xpEarned ?? 0) >= 150 ? "mission_bonus" : "mission_completed";
    }
    if (isStreakMilestone(state.streak + (log.completed ? 1 : 0))) {
      action = "streak_milestone";
    }
    setAvatarQuote(
      getAvatarMessage({
        affinity: state.affinity,
        actionType: action,
        streak: state.streak,
        userName: state.profile?.name,
        bonusAchieved: (log.xpEarned ?? 0) >= 150,
        completed: log.completed,
      }),
    );
    if (log.completed && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const ratios = state.exercises.map((ex) => Number(vals[ex.id] ?? 0) / ex.target);
  const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  const completedPreview = ratios.every((r) => r >= 1);
  const bonusPreview = completedPreview && avg - 1 >= 0.25;

  return (
    <div className="max-w-3xl mx-auto space-y-5 sm:space-y-6 animate-fade-in-up">
      <SystemMessage>
        Misión diaria activada. Registra tu progreso real en cada ejercicio. El sistema validará la misión y aplicará el multiplicador del pacto.
      </SystemMessage>

      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="violet">Pacto · {PACT_LABEL[state.pact]} (x{PACT_MULTIPLIER[state.pact]})</Badge>
        {completedPreview && <Badge tone="success">Mínimo alcanzado</Badge>}
        {bonusPreview && <Badge tone="violet">Bonus XP activo</Badge>}
      </div>

      <ActiveEffectsBar effects={state.effects} />

      {restDay && (
        <SystemMessage>
          Descanso autorizado hoy. No puedes registrar misión; tu afinidad y racha se mantienen.
        </SystemMessage>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {state.exercises.map((ex) => (
            <ExerciseCard key={ex.id} ex={ex} value={Number(vals[ex.id] ?? 0)}
              onChange={(n) => setVals((s) => ({ ...s, [ex.id]: n }))} />
          ))}
        </div>

        <div className="panel p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-muted-foreground">
            Estado:{" "}
            {completedPreview
              ? <span className="text-success font-display">OBJETIVO MÍNIMO DETECTADO · esfuerzo {Math.round(avg * 100)}%</span>
              : <span className="text-warning font-display">Pendiente</span>}
          </div>
          <NeonButton type="submit" variant={completedPreview ? "primary" : "ghost"} disabled={restDay}>
            ⚡ Registrar y completar
          </NeonButton>
        </div>
      </form>

      {itemMessages.map((msg, i) => (
        <SystemMessage key={`item-${i}`}>{msg}</SystemMessage>
      ))}

      {avatarQuote && (
        <SystemPanel eyebrow="Administrador/a del sistema" title="Transmisión" neon>
          <AvatarQuote message={avatarQuote} />
        </SystemPanel>
      )}

      {eventCompletions.map((n) => (
        <SystemMessage key={n.eventId}>
          Evento completado: <span className="text-neon font-display">{n.eventName}</span>.
          {" "}Has obtenido <span className="text-violet font-display">{n.itemName}</span> en tu inventario.
          {" "}
          <span className="block mt-2 text-violet/90 italic">
            &ldquo;{getAvatarMessage({
              affinity: state.affinity,
              actionType: "event_completed",
              eventName: n.eventName,
              itemName: n.itemName,
            })}&rdquo;
          </span>
        </SystemMessage>
      ))}

      {done && (
        <SystemPanel eyebrow={done.completed ? "Resultado" : "Resultado"}
          title={done.completed ? "Progreso registrado" : "Misión fallida"}
          neon={done.completed}>
          {done.completed ? (
            <div className="space-y-2 animate-fade-in-up">
              <p className="text-sm">
                Ganaste <span className="text-neon font-display">+{done.xpEarned} XP</span> y
                <span className="text-violet font-display"> +{done.affinityEarned} afinidad</span>.
                Racha actual: <strong className="text-foreground">{state.streak}</strong> días.
              </p>
              <div className="flex flex-wrap gap-1.5">
                <Badge tone="success">Misión completada</Badge>
                {done.xpEarned >= 150 && <Badge tone="violet">Bonus XP</Badge>}
                {state.streak >= 3 && <Badge tone="warning">Racha en llamas</Badge>}
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              {itemMessages.some((m) => m.includes("Escudo"))
                ? "Hoy no se cumplió el mínimo. Sin XP. Tu escudo protegió la racha."
                : "Hoy no se cumplió el mínimo. Sin XP, sin racha. El sistema esperará tu próximo intento."}
            </p>
          )}
        </SystemPanel>
      )}
    </div>
  );
}
