import { ITEM_CATALOG } from "./mock";
import type {
  ActiveEffect, DailyLog, GameState, InventorySlot, ItemId, UseItemResult,
} from "./types";

export const PENDING_EFFECT_ITEMS: ItemId[] = [
  "xp_bonus_50",
  "affinity_mult",
  "streak_shield",
];

export const ITEM_USE_MESSAGES: Record<ItemId, string> = {
  rest_pass: "Pase de descanso activado. Descanso autorizado por el sistema.",
  xp_bonus_50: "Bonus XP +50 activo.",
  affinity_mult: "Multiplicador de afinidad activo.",
  streak_shield: "Escudo de racha preparado.",
};

export const ACTIVE_EFFECT_LABELS: Record<ItemId, string> = {
  xp_bonus_50: "Bonus XP +50 activo",
  affinity_mult: "Multiplicador de afinidad activo",
  streak_shield: "Escudo de racha preparado",
  rest_pass: "",
};

export interface MissionRewardResult {
  xpEarned: number;
  affinityEarned: number;
  effects: ActiveEffect[];
  messages: string[];
  streakShieldUsed: boolean;
}

export function inventoryQty(inventory: InventorySlot[], itemId: ItemId): number {
  return inventory.find((s) => s.itemId === itemId)?.quantity ?? 0;
}

export function consumeInventory(
  inventory: InventorySlot[],
  itemId: ItemId,
  amount = 1,
): InventorySlot[] {
  const qty = inventoryQty(inventory, itemId);
  if (qty < amount) return inventory;
  const next = inventory
    .map((s) =>
      s.itemId === itemId ? { ...s, quantity: s.quantity - amount } : s,
    )
    .filter((s) => s.quantity > 0);
  return next;
}

export function hasActiveEffect(effects: ActiveEffect[], itemId: ItemId): boolean {
  return effects.some((e) => e.itemId === itemId);
}

function newEffect(itemId: ItemId, date: string): ActiveEffect {
  return { id: `${itemId}-${date}-${Date.now()}`, itemId, activatedAt: date };
}

export function addPendingEffect(
  effects: ActiveEffect[],
  itemId: ItemId,
  date: string,
): ActiveEffect[] {
  return [...effects.filter((e) => e.itemId !== itemId), newEffect(itemId, date)];
}

export function removeEffectsByItem(
  effects: ActiveEffect[],
  itemIds: ItemId[],
): ActiveEffect[] {
  const drop = new Set(itemIds);
  return effects.filter((e) => !drop.has(e.itemId));
}

export function todayRestUsed(history: DailyLog[], today: string): boolean {
  return history.some((h) => h.date === today && h.restAuthorized);
}

export function canUseRestPass(
  state: Pick<GameState, "history" | "todayLog" | "inventory">,
  today: string,
): UseItemResult {
  if (inventoryQty(state.inventory, "rest_pass") < 1) {
    return { ok: false, message: "No tienes Pase de descanso disponible." };
  }
  if (todayRestUsed(state.history, today)) {
    return { ok: false, message: "Ya usaste un Pase de descanso hoy." };
  }
  if (state.todayLog && !state.todayLog.restAuthorized) {
    return { ok: false, message: "Ya registraste la misión de hoy. El pase solo aplica antes de registrar." };
  }
  return { ok: true, message: "" };
}

export function applyRestPass(
  state: GameState,
  today: string,
): { state: Pick<GameState, "history" | "todayLog" | "inventory">; result: UseItemResult } {
  const check = canUseRestPass(state, today);
  if (!check.ok) return { state: {}, result: check };

  const log: DailyLog = {
    date: today,
    values: {},
    completed: false,
    failed: false,
    xpEarned: 0,
    affinityEarned: 0,
    restAuthorized: true,
  };
  const history = [...state.history.filter((h) => h.date !== today), log];

  return {
    state: {
      history,
      todayLog: log,
      inventory: consumeInventory(state.inventory, "rest_pass"),
    },
    result: { ok: true, message: ITEM_USE_MESSAGES.rest_pass },
  };
}

export function canUsePendingItem(
  state: Pick<GameState, "inventory" | "effects">,
  itemId: ItemId,
): UseItemResult {
  if (!PENDING_EFFECT_ITEMS.includes(itemId)) {
    return { ok: false, message: "Este objeto no se puede activar así." };
  }
  if (inventoryQty(state.inventory, itemId) < 1) {
    return { ok: false, message: `No tienes ${ITEM_CATALOG[itemId].name} disponible.` };
  }
  if (hasActiveEffect(state.effects, itemId)) {
    return { ok: false, message: `Ya tienes ${ITEM_CATALOG[itemId].name} activo.` };
  }
  return { ok: true, message: "" };
}

export function activatePendingItem(
  state: Pick<GameState, "inventory" | "effects">,
  itemId: ItemId,
  today: string,
): { inventory: InventorySlot[]; effects: ActiveEffect[]; result: UseItemResult } {
  const check = canUsePendingItem(state, itemId);
  if (!check.ok) {
    return { inventory: state.inventory, effects: state.effects, result: check };
  }
  return {
    inventory: consumeInventory(state.inventory, itemId),
    effects: addPendingEffect(state.effects, itemId, today),
    result: { ok: true, message: ITEM_USE_MESSAGES[itemId] },
  };
}

export function useItem(
  state: GameState,
  itemId: ItemId,
  today: string,
): { next: Partial<GameState>; result: UseItemResult } {
  if (itemId === "rest_pass") {
    const { state: patch, result } = applyRestPass(state, today);
    return { next: patch, result };
  }
  if (PENDING_EFFECT_ITEMS.includes(itemId)) {
    const { inventory, effects, result } = activatePendingItem(state, itemId, today);
    return { next: { inventory, effects }, result };
  }
  return { next: {}, result: { ok: false, message: "Objeto desconocido." } };
}

/** Aplica XP, afinidad, racha y consume efectos pendientes tras registrar misión. */
export function applyMissionRewards(
  completed: boolean,
  baseXp: number,
  baseAffGain: number,
  streak: number,
  affinity: number,
  effects: ActiveEffect[],
): MissionRewardResult {
  const messages: string[] = [];
  let nextEffects = [...effects];
  let streakShieldUsed = false;

  if (!completed) {
    const affinityEarned = -3;
    if (hasActiveEffect(effects, "streak_shield")) {
      streakShieldUsed = true;
      nextEffects = removeEffectsByItem(nextEffects, ["streak_shield"]);
      messages.push("Escudo de racha consumido. Tu racha se mantiene.");
    }
    return {
      xpEarned: 0,
      affinityEarned,
      effects: nextEffects,
      messages,
      streakShieldUsed,
    };
  }

  let xpEarned = baseXp;
  let affinityEarned = baseAffGain;

  if (hasActiveEffect(effects, "xp_bonus_50")) {
    xpEarned += 50;
    nextEffects = removeEffectsByItem(nextEffects, ["xp_bonus_50"]);
    messages.push("Bonus XP +50 aplicado (+50 XP).");
  }
  if (hasActiveEffect(effects, "affinity_mult")) {
    affinityEarned = baseAffGain * 2;
    nextEffects = removeEffectsByItem(nextEffects, ["affinity_mult"]);
    messages.push("Multiplicador de afinidad aplicado (x2).");
  }

  return {
    xpEarned,
    affinityEarned,
    effects: nextEffects,
    messages,
    streakShieldUsed,
  };
}

export function computeStreakAfterMission(
  completed: boolean,
  currentStreak: number,
  streakShieldUsed: boolean,
): number {
  if (completed) return currentStreak + 1;
  if (streakShieldUsed) return currentStreak;
  return 0;
}
