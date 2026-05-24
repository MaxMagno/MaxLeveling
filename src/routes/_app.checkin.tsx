import { createFileRoute } from "@tanstack/react-router";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { NeonButton } from "@/components/ml/NeonButton";

export const Route = createFileRoute("/_app/checkin")({ component: Checkin });

function Checkin() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <SystemMessage>
        Check-in corporal mensual · Vista previa. Pronto podrás registrar peso, masa muscular
        y recibir frases del avatar comparando con el mes anterior.
      </SystemMessage>

      <SystemPanel eyebrow="Próxima fase" title="Check-in mensual" neon>
        <p className="text-sm text-muted-foreground mb-4">
          Este módulo está preparado visualmente. La lógica de comparación mes a mes y la
          generación de feedback del avatar llegará junto con la integración de IA.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {["Peso actual", "Masa muscular", "Unidad", "Comentario"].map((l) => (
            <div key={l} className="panel p-3 opacity-60">
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{l}</div>
              <div className="h-6 mt-1 bg-input/40 rounded" />
            </div>
          ))}
        </div>
        <NeonButton disabled variant="ghost">Próximamente</NeonButton>
      </SystemPanel>
    </div>
  );
}
