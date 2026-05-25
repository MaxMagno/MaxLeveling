import { addInventoryItem } from "./items";
import { ITEM_CATALOG } from "./mock";
import type {
  DailyLog,
  EventCompletionNotice,
  GameEvent,
  GameState,
  InventorySlot,
  ItemId,
} from "./types";

export const EVENT_IDS = {
  piernasAcero: "piernas_acero",
  cazadorConstante: "cazador_constante",
  nucleoEstable: "nucleo_estable",
  semanaPerfecta: "semana_perfecta",
} as const;

export const DEFAULT_EVENT_IDS: readonly string[] = [
  EVENT_IDS.piernasAcero,
  EVENT_IDS.cazadorConstante,
  EVENT_IDS.nucleoEstable,
  EVENT_IDS.semanaPerfecta,
];

export function hasValidEventSet(events: GameEvent[] | undefined): boolean {
  if (!events?.length) return false;
  const ids = new Set(events.map((e) => e.id));
  return DEFAULT_EVENT_IDS.length === ids.size && DEFAULT_EVENT_IDS.every((id) => ids.has(id));
}

function weekLogs(history: DailyLog[], weekStartIso: string): DailyLog[] {
  return history.filter((h) => h.date >= weekStartIso);
}

function progressForEvent(
  eventId: string,
  logs: DailyLog[],
  exercises: GameState["exercises"],
): number {
  const plankTarget = exercises.find((e) => e.id === "plank")?.target ?? 30;

  switch (eventId) {
    case EVENT_IDS.piernasAcero:
      return logs.reduce((sum, h) => sum + Number(h.values.squat ?? 0), 0);
    case EVENT_IDS.cazadorConstante:
    case EVENT_IDS.semanaPerfecta:
      return logs.filter((h) => h.completed).length;
    case EVENT_IDS.nucleoEstable:
      return logs.filter((h) => Number(h.values.plank ?? 0) >= plankTarget).length;
    default:
      return 0;
  }
}

export interface ApplyEventsResult {
  events: GameEvent[];
  inventory: InventorySlot[];
  completions: EventCompletionNotice[];
}

/** Recalcula progreso semanal, completa eventos y entrega recompensas una sola vez. */
export function applyEventsAfterDaily(
  state: Pick<GameState, "events" | "inventory" | "exercises" | "weekStartIso">,
  history: DailyLog[],
): ApplyEventsResult {
  const logs = weekLogs(history, state.weekStartIso);
  let inventory = state.inventory;
  const completions: EventCompletionNotice[] = [];

  const events = state.events.map((event) => {
    if (event.status === "completed") return event;

    const progress = progressForEvent(event.id, logs, state.exercises);
    if (progress < event.target) {
      return { ...event, progress };
    }

    inventory = addInventoryItem(inventory, event.rewardItemId);
    completions.push({
      eventId: event.id,
      eventName: event.name,
      itemId: event.rewardItemId,
      itemName: ITEM_CATALOG[event.rewardItemId].name,
    });
    return {
      ...event,
      progress: event.target,
      status: "completed" as GameEvent["status"],
    };
  });

  return { events, inventory, completions };
}

/** Sincroniza progreso visual desde history sin otorgar recompensas. */
export function syncEventsProgress(
  events: GameEvent[],
  history: DailyLog[],
  weekStartIso: string,
  exercises: GameState["exercises"],
): GameEvent[] {
  const logs = weekLogs(history, weekStartIso);
  return events.map((event) => {
    if (event.status === "completed") return event;
    const progress = progressForEvent(event.id, logs, exercises);
    return { ...event, progress: Math.min(progress, event.target) };
  });
}
