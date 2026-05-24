import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { SystemPanel, SystemMessage } from "@/components/ml/SystemPanel";
import { Field, Select, TextInput } from "@/components/ml/Field";
import { NeonButton } from "@/components/ml/NeonButton";
import { AvatarCard } from "@/components/ml/AvatarCard";
import { useGame } from "@/lib/game/store";
import type { AvatarStyle, EyeColor, HairColor, HairStyle, SkinTone } from "@/lib/game/types";

export const Route = createFileRoute("/onboarding/avatar")({ component: AvatarStep });

function AvatarStep() {
  const { state, setAvatar } = useGame();
  const nav = useNavigate();
  const [a, setA] = useState({
    name: "Aria", style: "femenino" as AvatarStyle,
    skinTone: "media" as SkinTone, hairColor: "azul_oscuro" as HairColor,
    hairStyle: "largo_liso" as HairStyle, eyeColor: "azul" as EyeColor,
  });
  if (!state.profile) return <Navigate to="/onboarding/profile" />;
  const upd = <K extends keyof typeof a>(k: K, v: (typeof a)[K]) =>
    setA((s) => ({ ...s, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setAvatar(a);
    nav({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen px-4 py-8 sm:py-14 relative z-10">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="text-center space-y-2">
          <div className="chip mx-auto">Inicialización · Paso 2 de 2</div>
          <h1 className="font-display text-3xl sm:text-4xl">Crear Administrador/a del Sistema</h1>
          <p className="text-sm text-muted-foreground">
            Antes de iniciar tu progreso, configura a tu Administrador/a del Sistema.
          </p>
        </header>

        <SystemMessage>
          La afinidad evoluciona la vestimenta, pose y cercanía. Los rasgos elegidos se mantienen entre fases.
        </SystemMessage>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <SystemPanel eyebrow="Configuración" title="Rasgos del avatar" neon>
            <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label="Nombre del avatar">
                  <TextInput required value={a.name} onChange={(e) => upd("name", e.target.value)} />
                </Field>
              </div>
              <Field label="Sexo / estilo">
                <Select value={a.style} onChange={(e) => upd("style", e.target.value as AvatarStyle)}>
                  <option value="femenino">Femenino</option>
                  <option value="masculino">Masculino</option>
                  <option value="androgeno">Andrógeno</option>
                  <option value="no_definido">No definido</option>
                </Select>
              </Field>
              <Field label="Tono de piel">
                <Select value={a.skinTone} onChange={(e) => upd("skinTone", e.target.value as SkinTone)}>
                  <option value="muy_clara">Muy clara</option>
                  <option value="clara">Clara</option>
                  <option value="media">Media</option>
                  <option value="morena">Morena</option>
                  <option value="oscura">Oscura</option>
                </Select>
              </Field>
              <Field label="Color de pelo">
                <Select value={a.hairColor} onChange={(e) => upd("hairColor", e.target.value as HairColor)}>
                  <option value="negro">Negro</option>
                  <option value="castano_oscuro">Castaño oscuro</option>
                  <option value="castano_claro">Castaño claro</option>
                  <option value="rubio">Rubio</option>
                  <option value="pelirrojo">Pelirrojo</option>
                  <option value="blanco_plata">Blanco / plata</option>
                  <option value="azul_oscuro">Azul oscuro</option>
                  <option value="violeta">Violeta</option>
                </Select>
              </Field>
              <Field label="Corte de pelo">
                <Select value={a.hairStyle} onChange={(e) => upd("hairStyle", e.target.value as HairStyle)}>
                  <option value="largo_liso">Largo liso</option>
                  <option value="largo_ondulado">Largo ondulado</option>
                  <option value="media_melena">Media melena</option>
                  <option value="bob_corto">Bob corto</option>
                  <option value="coleta_alta">Coleta alta</option>
                  <option value="coleta_baja">Coleta baja</option>
                  <option value="largo_flequillo">Largo con flequillo</option>
                  <option value="corto_texturizado">Corto texturizado</option>
                  <option value="medio_despeinado">Medio despeinado</option>
                </Select>
              </Field>
              <Field label="Color de ojos">
                <Select value={a.eyeColor} onChange={(e) => upd("eyeColor", e.target.value as EyeColor)}>
                  <option value="marron">Marrón</option>
                  <option value="azul">Azul</option>
                  <option value="verde">Verde</option>
                  <option value="gris">Gris</option>
                  <option value="violeta">Violeta</option>
                  <option value="ambar">Ámbar</option>
                </Select>
              </Field>

              <div className="sm:col-span-2 flex items-center justify-between pt-3">
                <button type="button" onClick={() => nav({ to: "/onboarding/profile" })}
                  className="text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">
                  ← Volver
                </button>
                <NeonButton type="submit" variant="violet">⚡ Activar sistema</NeonButton>
              </div>
            </form>
          </SystemPanel>

          <div className="lg:sticky lg:top-6 h-fit">
            <AvatarCard avatar={a} affinity={state.affinity} />
          </div>
        </div>
      </div>
    </div>
  );
}
