import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AvatarQuote } from "@/components/ml/AvatarQuote";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { Field, Select, TextInput } from "@/components/ml/Field";
import { NeonButton } from "@/components/ml/NeonButton";
import { Badge } from "@/components/ml/Badge";
import { useGame } from "@/lib/game/store";
import { checkinForMonth, formatDelta, monthKey, sortedCheckins } from "@/lib/game/bodyCheckin";

export const Route = createFileRoute("/_app/checkin")({ component: Checkin });

function Checkin() {
  const { state, registerBodyCheckin } = useGame();
  const profile = state.profile!;
  const thisMonth = checkinForMonth(state.bodyCheckins);
  const latest = sortedCheckins(state.bodyCheckins)[0];
  const currentMonthKey = monthKey(new Date().toISOString().slice(0, 10));

  const [weightKg, setWeightKg] = useState(() => thisMonth?.weightKg ?? profile.weightKg);
  const [muscleMassValue, setMuscleMassValue] = useState<number | "">(
    () => thisMonth?.muscleMassValue ?? profile.muscleMass ?? "",
  );
  const [muscleMassUnit, setMuscleMassUnit] = useState<"kg" | "percent">(
    () => thisMonth?.muscleMassUnit ?? profile.muscleMassUnit ?? "kg",
  );
  const [userComment, setUserComment] = useState(thisMonth?.userComment ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (muscleMassValue === "") {
      setFeedback("Indica tu masa muscular estimada.");
      return;
    }
    const result = registerBodyCheckin({
      weightKg: Number(weightKg),
      muscleMassValue: Number(muscleMassValue),
      muscleMassUnit,
      userComment: userComment || undefined,
    });
    setFeedback(result.message);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in-up">
      <header>
        <div className="system-eyebrow">Body status</div>
        <h1 className="font-display text-2xl mt-1">Check-in corporal mensual</h1>
      </header>

      <SystemMessage>El sistema requiere actualización de estado físico.</SystemMessage>

      {thisMonth && (
        <SystemMessage>
          Ya has registrado el check-in de este mes. Puedes actualizar los datos abajo; la
          recompensa no se duplicará.
        </SystemMessage>
      )}

      {feedback && <SystemMessage>{feedback}</SystemMessage>}

      {latest && (
        <SystemPanel eyebrow="Último registro" title={latest.date} neon>
          <AvatarQuote message={latest.avatarFeedback} className="mb-3" />
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-muted-foreground">Peso</span>
              <div className="font-display text-foreground">{latest.weightKg} kg</div>
              {latest.weightDelta !== undefined && (
                <div className="text-neon mt-0.5">Δ {formatDelta(latest.weightDelta, "kg")}</div>
              )}
            </div>
            <div>
              <span className="text-muted-foreground">Masa muscular</span>
              <div className="font-display text-foreground">
                {latest.muscleMassValue} {latest.muscleMassUnit}
              </div>
              {latest.muscleDelta !== undefined && (
                <div className="text-neon mt-0.5">
                  Δ {formatDelta(latest.muscleDelta, latest.muscleMassUnit)}
                </div>
              )}
            </div>
          </div>
          {latest.rewardGranted && (
            <p className="text-[10px] uppercase tracking-widest text-success mt-3">
              Recompensa otorgada · Afinidad +5 · Bonus XP +50
            </p>
          )}
        </SystemPanel>
      )}

      <SystemPanel eyebrow="Registro" title="Datos corporales" neon>
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Peso actual (kg)">
            <TextInput
              type="number"
              min={30}
              max={250}
              step="0.1"
              required
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Masa muscular estimada">
              <TextInput
                type="number"
                min={0}
                step="0.1"
                required
                value={muscleMassValue}
                onChange={(e) =>
                  setMuscleMassValue(e.target.value === "" ? "" : Number(e.target.value))
                }
              />
            </Field>
            <Field label="Unidad masa muscular">
              <Select
                value={muscleMassUnit}
                onChange={(e) => setMuscleMassUnit(e.target.value as "kg" | "percent")}
              >
                <option value="kg">kg</option>
                <option value="percent">%</option>
              </Select>
            </Field>
          </div>
          <Field label="Comentario (opcional)">
            <TextInput
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Cómo te sientes este mes…"
            />
          </Field>
          <NeonButton type="submit" variant="violet">
            Registrar check-in
          </NeonButton>
        </form>
      </SystemPanel>

      {state.bodyCheckins.length > 0 && (
        <SystemPanel eyebrow="Historial corporal" title="Registros recientes">
          <ul className="space-y-3">
            {sortedCheckins(state.bodyCheckins).map((c) => (
              <li key={c.id} className="panel p-3 text-sm">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-display">{c.date}</span>
                  {monthKey(c.date) === currentMonthKey && <Badge tone="muted">Este mes</Badge>}
                </div>
                <p className="text-xs text-muted-foreground">
                  {c.weightKg} kg · {c.muscleMassValue} {c.muscleMassUnit}
                  {c.weightDelta !== undefined && ` · Peso Δ ${formatDelta(c.weightDelta, "kg")}`}
                </p>
              </li>
            ))}
          </ul>
        </SystemPanel>
      )}
    </div>
  );
}
