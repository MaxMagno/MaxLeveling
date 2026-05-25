import { addInventoryItem } from "./items";
import type {
  BodyCheckin, BodyCheckinInput, DailyLog, GameState, RegisterBodyCheckinResult,
} from "./types";

const AVATAR_FEEDBACK = {
  first: "Registro corporal inicial completado. A partir de ahora, el sistema medirá tu evolución.",
  muscleUp: "Se nota el trabajo. Tu cuerpo está respondiendo. Estás construyendo algo real.",
  lighterStronger: "Más ligero y más fuerte. Eso no es suerte, es disciplina.",
  weightUpMuscleUp: "El número de la báscula no cuenta toda la historia. Estás ganando estructura.",
  consistency: "Puede que el espejo tarde, pero tus hábitos ya cambiaron. Sigue.",
  setback: "No voy a maquillarlo: este mes no avanzaste como podías. Pero aún estás dentro del sistema. Reinicia.",
} as const;

export function monthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function checkinForMonth(
  checkins: BodyCheckin[],
  isoMonth = monthKey(new Date().toISOString().slice(0, 10)),
): BodyCheckin | undefined {
  return checkins.find((c) => monthKey(c.date) === isoMonth);
}

export function checkinMonthStatus(
  checkins: BodyCheckin[],
  isoMonth = monthKey(new Date().toISOString().slice(0, 10)),
): "pending" | "completed" {
  return checkinForMonth(checkins, isoMonth) ? "completed" : "pending";
}

function previousCheckin(checkins: BodyCheckin[], beforeDate: string): BodyCheckin | undefined {
  return [...checkins]
    .filter((c) => c.date < beforeDate)
    .sort((a, b) => b.date.localeCompare(a.date))[0];
}

function hadRecentConsistency(history: DailyLog[], date: string): boolean {
  const mk = monthKey(date);
  const inMonth = history.filter((h) => h.date.startsWith(mk) && h.completed).length;
  const last14 = history.filter((h) => h.completed).slice(-14).length;
  return inMonth >= 3 || last14 >= 5;
}

export function generateAvatarFeedback(
  previous: BodyCheckin | undefined,
  weightDelta: number | undefined,
  muscleDelta: number | undefined,
  consistent: boolean,
): string {
  if (!previous) return AVATAR_FEEDBACK.first;

  const w = weightDelta ?? 0;
  const m = muscleDelta ?? 0;

  if (muscleDelta !== undefined && m <= -0.3) return AVATAR_FEEDBACK.setback;
  if (w >= 1.5 && (muscleDelta === undefined || m <= 0)) return AVATAR_FEEDBACK.setback;

  if (muscleDelta !== undefined && m >= 0.3) {
    if (w >= 0.3) return AVATAR_FEEDBACK.weightUpMuscleUp;
    return AVATAR_FEEDBACK.muscleUp;
  }

  if (w <= -0.3 && (muscleDelta === undefined || m >= -0.2)) {
    return AVATAR_FEEDBACK.lighterStronger;
  }

  if (Math.abs(w) < 0.5 && (muscleDelta === undefined || Math.abs(m) < 0.5) && consistent) {
    return AVATAR_FEEDBACK.consistency;
  }

  if (consistent) return AVATAR_FEEDBACK.consistency;
  return AVATAR_FEEDBACK.setback;
}

export function registerBodyCheckin(
  state: Pick<GameState, "bodyCheckins" | "history" | "affinity" | "inventory">,
  input: BodyCheckinInput,
  today: string,
): RegisterBodyCheckinResult & {
  next: Pick<GameState, "bodyCheckins" | "affinity" | "inventory">;
} {
  const mk = monthKey(today);
  const existingMonth = checkinForMonth(state.bodyCheckins, mk);
  const previous = previousCheckin(
    state.bodyCheckins.filter((c) => monthKey(c.date) !== mk),
    today,
  );

  const weightDelta = previous ? input.weightKg - previous.weightKg : undefined;
  let muscleDelta: number | undefined;
  if (previous && previous.muscleMassUnit === input.muscleMassUnit) {
    muscleDelta = input.muscleMassValue - previous.muscleMassValue;
  }

  const avatarFeedback = generateAvatarFeedback(
    previous,
    weightDelta,
    muscleDelta,
    hadRecentConsistency(state.history, today),
  );

  const grantReward = !existingMonth?.rewardGranted;
  let affinity = state.affinity;
  let inventory = state.inventory;
  if (grantReward) {
    affinity = Math.min(100, affinity + 5);
    inventory = addInventoryItem(inventory, "xp_bonus_50");
  }

  const checkin: BodyCheckin = {
    id: existingMonth?.id ?? `checkin-${today}-${Date.now()}`,
    date: today,
    weightKg: input.weightKg,
    muscleMassValue: input.muscleMassValue,
    muscleMassUnit: input.muscleMassUnit,
    userComment: input.userComment?.trim() || undefined,
    avatarFeedback,
    weightDelta,
    muscleDelta,
    rewardGranted: true,
  };

  const bodyCheckins = [
    ...state.bodyCheckins.filter((c) => monthKey(c.date) !== mk),
    checkin,
  ];

  const message = grantReward
    ? "Check-in completado. Afinidad +5. Recompensa añadida al inventario."
    : existingMonth
      ? "Check-in de este mes actualizado. La recompensa ya fue otorgada."
      : "Check-in completado.";

  return {
    ok: true,
    message,
    checkin,
    rewardGranted: grantReward,
    next: { bodyCheckins, affinity, inventory },
  };
}

export function sortedCheckins(checkins: BodyCheckin[]): BodyCheckin[] {
  return [...checkins].sort((a, b) => b.date.localeCompare(a.date));
}

export function formatDelta(value: number | undefined, unit: string): string {
  if (value === undefined) return "—";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)} ${unit}`;
}
