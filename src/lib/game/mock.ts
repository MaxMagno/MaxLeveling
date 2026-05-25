import type {
  ActiveEffect,
  GameEvent,
  InventorySlot,
  ItemDefinition,
  ItemId,
} from "./types";
import { ITEM_RARITY_LABEL } from "./types";

export const ITEM_CATALOG: Record<ItemId, ItemDefinition> = {
  rest_pass: {
    id: "rest_pass",
    name: "Pase de descanso",
    description: "Salta un día sin perder afinidad ni racha.",
    rarity: "comun",
  },
  streak_shield: {
    id: "streak_shield",
    name: "Escudo de racha",
    description: "Protege la racha ante 1 fallo.",
    rarity: "epico",
  },
  xp_bonus_50: {
    id: "xp_bonus_50",
    name: "Bonus XP +50",
    description: "Añade 50 XP al completar la próxima misión.",
    rarity: "raro",
  },
  affinity_mult: {
    id: "affinity_mult",
    name: "Multiplicador de afinidad",
    description: "Duplica la afinidad ganada en una misión.",
    rarity: "raro",
  },
};

export const MOCK_EVENTS: GameEvent[] = [
  {
    id: "piernas_acero",
    name: "Piernas de acero",
    description: "200 sentadillas en la semana.",
    rewardItemId: "rest_pass",
    progress: 0,
    target: 200,
    status: "active",
  },
  {
    id: "cazador_constante",
    name: "Cazador constante",
    description: "5 días de misión completados en la semana.",
    rewardItemId: "streak_shield",
    progress: 2,
    target: 5,
    status: "active",
  },
  {
    id: "nucleo_estable",
    name: "Núcleo estable",
    description: "3 días de plancha completada en la semana.",
    rewardItemId: "affinity_mult",
    progress: 0,
    target: 3,
    status: "active",
  },
  {
    id: "semana_perfecta",
    name: "Semana perfecta",
    description: "7 días de misión completados en la semana.",
    rewardItemId: "xp_bonus_50",
    progress: 0,
    target: 7,
    status: "active",
  },
];

export const DEFAULT_INVENTORY: InventorySlot[] = [
  { itemId: "rest_pass", quantity: 2 },
  { itemId: "streak_shield", quantity: 1 },
  { itemId: "xp_bonus_50", quantity: 3 },
  { itemId: "affinity_mult", quantity: 1 },
];

export const DEFAULT_EFFECTS: ActiveEffect[] = [];

export function itemById(id: ItemId): ItemDefinition {
  return ITEM_CATALOG[id];
}

export function eventRewardLabel(event: GameEvent): string {
  const item = ITEM_CATALOG[event.rewardItemId];
  return `1 ${item.name}`;
}

export function itemRarityLabel(item: ItemDefinition): string {
  return ITEM_RARITY_LABEL[item.rarity];
}
