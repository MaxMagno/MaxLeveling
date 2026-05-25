import { DEFAULT_EVENTS } from "./mock";
import { DEFAULT_EVENT_IDS, hasValidEventSet, syncEventsProgress } from "./events";
import type { GameEvent, GameState } from "./types";

/** Reconstruye eventos desde el catálogo, conservando progreso/estado por id conocido. */
export function rebuildEventsFromDefaults(persisted?: GameEvent[]): GameEvent[] {
  const byId = new Map((persisted ?? []).map((e) => [e.id, e]));
  return DEFAULT_EVENTS.map((def) => {
    const old = byId.get(def.id);
    if (!old) return { ...def };
    return {
      ...def,
      progress: old.status === "completed" ? def.target : old.progress,
      status: old.status,
    };
  });
}

export function migrateHydratedState(parsed: Partial<GameState>, initial: GameState): GameState {
  const merged = { ...initial, ...parsed };

  let events = merged.events;
  if (!hasValidEventSet(events)) {
    events = rebuildEventsFromDefaults(events);
  }

  events = syncEventsProgress(events, merged.history, merged.weekStartIso, merged.exercises);

  return {
    ...merged,
    events,
    bodyCheckins: Array.isArray(merged.bodyCheckins) ? merged.bodyCheckins : [],
  };
}

export { DEFAULT_EVENT_IDS, hasValidEventSet };
