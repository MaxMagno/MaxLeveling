import { createFileRoute } from "@tanstack/react-router";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";

export const Route = createFileRoute("/_app/inventory")({ component: Inventory });

const STUB = [
  { name: "Pase de descanso", rarity: "Común", desc: "Salta un día sin perder afinidad ni racha.", qty: 2 },
  { name: "Escudo de racha", rarity: "Épico", desc: "Protege la racha ante 1 fallo.", qty: 1 },
  { name: "Bonus XP +50", rarity: "Raro", desc: "Añade 50 XP al completar la próxima misión.", qty: 3 },
  { name: "Multiplicador de afinidad", rarity: "Raro", desc: "Duplica la afinidad ganada en una misión.", qty: 1 },
];

function Inventory() {
  return (
    <div className="space-y-6">
      <SystemMessage>
        Inventario · Vista previa. La gestión completa de items, rareza y caducidad llegará en la próxima fase.
      </SystemMessage>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {STUB.map((it) => (
          <SystemPanel key={it.name} eyebrow={it.rarity} title={it.name}>
            <p className="text-sm text-muted-foreground mb-3">{it.desc}</p>
            <div className="flex items-center justify-between">
              <span className="chip">x{it.qty}</span>
              <button disabled className="text-xs uppercase tracking-widest text-muted-foreground/60">
                Usar (próximamente)
              </button>
            </div>
          </SystemPanel>
        ))}
      </div>
    </div>
  );
}
