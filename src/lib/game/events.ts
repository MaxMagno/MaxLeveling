import type { DailyLog, GameEvent, GameState, InventorySlot, ItemId } from "./types";

export const EVENT_IDS = {
  piernasAcero: "piernas_acero",
  cazadorConstante: "cazador_constante",
  nucleoEstable: "nucleo_estable",
  semanaPerfecta: "semana_perfecta",
} as const;

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

function addInventoryItem(
  inventory: InventorySlot[],
  itemId: ItemId,
  amount = 1,
): InventorySlot[] {
  const idx = inventory.findIndex((s) => s.itemId === itemId);
  if (idx >= 0) {
    return inventory.map((s, i) =>
      i === idx ? { ...s, quantity: s.quantity + amount } : s,
    );
  }
  return [...inventory, { itemId, quantity: amount }];
}

/** Recalcula progreso semanal, completa eventos y entrega recompensas una sola vez. */
export function applyEventsAfterDaily(
  state: Pick<GameState, "events" | "inventory" | "exercises" | "weekStartIso">,
  history: DailyLog[],
): Pick<GameState, "events" | "inventory"> {
  const logs = weekLogs(history, state.weekStartIso);
  let inventory = state.inventory;

  const events = state.events.map((event) => {
    if (event.status === "completed") return event;

    const progress = progressForEvent(event.id, logs, state.exercises);
    if (progress < event.target) {
      return { ...event, progress };
    }

    inventory = addInventoryItem(inventory, event.rewardItemId);
    return {
      ...event,
      progress: event.target,
      status: "completed" as GameEvent["status"],
    };
  });

  return { events, inventory };
}
