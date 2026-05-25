import { Badge } from "@/components/ml/Badge";
import { ACTIVE_EFFECT_LABELS } from "@/lib/game/items";
import type { ActiveEffect } from "@/lib/game/types";

export function ActiveEffectsBar({ effects }: { effects: ActiveEffect[] }) {
  if (!effects.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {effects.map((e) => (
        <Badge key={e.id} tone="violet">
          {ACTIVE_EFFECT_LABELS[e.itemId]}
        </Badge>
      ))}
    </div>
  );
}
