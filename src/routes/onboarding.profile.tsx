import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { Field, Select, TextInput } from "@/components/ml/Field";
import { NeonButton } from "@/components/ml/NeonButton";
import { useGame } from "@/lib/game/store";
import { OnboardingProgress } from "@/components/ml/OnboardingProgress";
import type { FitnessLevel, MainGoal, UserGender } from "@/lib/game/types";
import { onboardingStepLabel } from "@/lib/game/types";

export const Route = createFileRoute("/onboarding/profile")({ component: ProfileStep });

function ProfileStep() {
  const { setProfile } = useGame();
  const nav = useNavigate();
  const [f, setF] = useState({
    name: "", age: 25, heightCm: 175, weightKg: 70,
    muscleMass: "" as number | "", muscleMassUnit: "kg" as "kg" | "percent",
    gender: "no_indica" as UserGender,
    fitnessLevel: "principiante" as FitnessLevel,
    limitations: "", goal: "habito" as MainGoal,
  });
  const upd = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((s) => ({ ...s, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile({
      name: f.name.trim() || "Jugador",
      age: Number(f.age), heightCm: Number(f.heightCm), weightKg: Number(f.weightKg),
      muscleMass: f.muscleMass === "" ? undefined : Number(f.muscleMass),
      muscleMassUnit: f.muscleMassUnit,
      gender: f.gender, fitnessLevel: f.fitnessLevel,
      limitations: f.limitations || undefined, goal: f.goal,
    });
    nav({ to: "/onboarding/avatar" });
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-14 relative z-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <div className="chip mx-auto">{onboardingStepLabel(1)}</div>
          <OnboardingProgress step={1} />
          <h1 className="font-display text-3xl sm:text-4xl">Crear perfil de jugador</h1>
          <p className="text-sm text-muted-foreground">
            Estos datos calibran tu esfuerzo, seguridad y progresión. No definen lo que puedes lograr.
          </p>
        </header>

        <SystemMessage>
          El sistema MaxLeveling te asignará misiones diarias adaptadas a tu nivel.
          Toda la información permanece en este dispositivo.
        </SystemMessage>

        <SystemPanel eyebrow="Datos del cazador" title="Identidad y físico" neon>
          <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Field label="Nombre del usuario">
                <TextInput required value={f.name} onChange={(e) => upd("name", e.target.value)}
                  placeholder="Tu nombre de cazador" />
              </Field>
            </div>
            <Field label="Edad">
              <TextInput type="number" min={10} max={100} value={f.age}
                onChange={(e) => upd("age", Number(e.target.value))} />
            </Field>
            <Field label="Sexo / género">
              <Select value={f.gender} onChange={(e) => upd("gender", e.target.value as UserGender)}>
                <option value="hombre">Hombre</option>
                <option value="mujer">Mujer</option>
                <option value="no_definido">No definido</option>
                <option value="no_indica">Prefiero no indicarlo</option>
              </Select>
            </Field>
            <Field label="Altura (cm)">
              <TextInput type="number" min={120} max={230} value={f.heightCm}
                onChange={(e) => upd("heightCm", Number(e.target.value))} />
            </Field>
            <Field label="Peso (kg)">
              <TextInput type="number" min={30} max={250} step="0.1" value={f.weightKg}
                onChange={(e) => upd("weightKg", Number(e.target.value))} />
            </Field>
            <Field label="Masa muscular (opcional)">
              <TextInput type="number" step="0.1" value={f.muscleMass}
                onChange={(e) => upd("muscleMass", e.target.value === "" ? "" : Number(e.target.value))} />
            </Field>
            <Field label="Unidad masa muscular">
              <Select value={f.muscleMassUnit}
                onChange={(e) => upd("muscleMassUnit", e.target.value as "kg" | "percent")}>
                <option value="kg">kg</option>
                <option value="percent">%</option>
              </Select>
            </Field>
            <Field label="Nivel físico">
              <Select value={f.fitnessLevel}
                onChange={(e) => upd("fitnessLevel", e.target.value as FitnessLevel)}>
                <option value="principiante">Principiante</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
                <option value="no_se">No lo sé</option>
              </Select>
            </Field>
            <Field label="Objetivo principal">
              <Select value={f.goal} onChange={(e) => upd("goal", e.target.value as MainGoal)}>
                <option value="habito">Crear hábito</option>
                <option value="perder_grasa">Perder grasa</option>
                <option value="ganar_musculo">Ganar músculo</option>
                <option value="resistencia">Mejorar resistencia</option>
                <option value="fuerza">Mejorar fuerza</option>
                <option value="activo">Mantenerme activo</option>
              </Select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Limitaciones físicas o lesiones (opcional)">
                <TextInput value={f.limitations} onChange={(e) => upd("limitations", e.target.value)}
                  placeholder="Ej: rodilla derecha sensible" />
              </Field>
            </div>

            <div className="sm:col-span-2 flex justify-end pt-2">
              <NeonButton type="submit">Continuar → Avatar</NeonButton>
            </div>
          </form>
        </SystemPanel>
      </div>
    </div>
  );
}
