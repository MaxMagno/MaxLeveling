import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { ActiveEffectsBar } from "@/components/ml/ActiveEffectsBar";
import { useGame } from "@/lib/game/store";
import { itemById, itemRarityLabel } from "@/lib/game/mock";
import { inventoryQty, PENDING_EFFECT_ITEMS } from "@/lib/game/items";
import type { ItemId } from "@/lib/game/types";

export const Route = createFileRoute("/_app/inventory")({ component: Inventory });

const ITEM_ORDER: ItemId[] = [
  "rest_pass",
  "streak_shield",
  "xp_bonus_50",
  "affinity_mult",
];

function Inventory() {
  const { state, useItem } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  const onUse = (itemId: ItemId) => {
    const result = useItem(itemId);
    setFeedback(result.message);
  };

  return (
    <div className="space-y-6">
      <SystemMessage>
        Inventario del cazador. Usa los objetos para preparar la próxima misión o autorizar descanso.
      </SystemMessage>

      {feedback && <SystemMessage>{feedback}</SystemMessage>}

      <ActiveEffectsBar effects={state.effects} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ITEM_ORDER.map((id) => {
          const it = itemById(id);
          const quantity = inventoryQty(state.inventory, id);
          const isPending = PENDING_EFFECT_ITEMS.includes(id);
          const isActive = state.effects.some((e) => e.itemId === id);
          const disabled = quantity < 1 || (isPending && isActive);

          return (
            <SystemPanel key={id} eyebrow={itemRarityLabel(it)} title={it.name}>
              <p className="text-sm text-muted-foreground mb-3">{it.description}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="chip">x{quantity}</span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onUse(id)}
                  className="text-xs uppercase tracking-widest text-primary hover:text-neon disabled:text-muted-foreground/50 disabled:cursor-not-allowed"
                >
                  Usar
                </button>
              </div>
              {isActive && (
                <p className="text-[10px] uppercase tracking-widest text-violet mt-2">
                  Efecto activo
                </p>
              )}
            </SystemPanel>
          );
        })}
      </div>
    </div>
  );
}
