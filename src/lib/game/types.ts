export type UserGender = "hombre" | "mujer" | "no_definido" | "no_indica";
export type FitnessLevel = "principiante" | "intermedio" | "avanzado" | "no_se";
export type MainGoal =
  | "habito" | "perder_grasa" | "ganar_musculo"
  | "resistencia" | "fuerza" | "activo";

export type AvatarStyle = "femenino" | "masculino" | "androgeno" | "no_definido";
export type SkinTone = "muy_clara" | "clara" | "media" | "morena" | "oscura";
export type HairColor =
  | "negro" | "castano_oscuro" | "castano_claro" | "rubio"
  | "pelirrojo" | "blanco_plata" | "azul_oscuro" | "violeta";
export type HairStyle =
  | "largo_liso" | "largo_ondulado" | "media_melena" | "bob_corto"
  | "coleta_alta" | "coleta_baja" | "largo_flequillo"
  | "corto_texturizado" | "medio_despeinado";
export type EyeColor = "marron" | "azul" | "verde" | "gris" | "violeta" | "ambar";

export interface UserProfile {
  name: string;
  age: number;
  heightCm: number;
  weightKg: number;
  muscleMass?: number;
  muscleMassUnit?: "kg" | "percent";
  gender: UserGender;
  fitnessLevel: FitnessLevel;
  limitations?: string;
  goal?: MainGoal;
}

export interface AvatarProfile {
  name: string;
  style: AvatarStyle;
  skinTone: SkinTone;
  hairColor: HairColor;
  hairStyle: HairStyle;
  eyeColor: EyeColor;
}

export type PactType = "progresion" | "mantener" | "reducir" | "descarga";

export interface Exercise {
  id: string;
  name: string;
  target: number;
  unit: "reps" | "sec" | "min";
}

export interface DailyLog {
  date: string;          // YYYY-MM-DD
  values: Record<string, number>;
  completed: boolean;
  xpEarned: number;
  affinityEarned: number;
  restAuthorized?: boolean;
  failed?: boolean;
}

export interface GameState {
  profile: UserProfile | null;
  avatar: AvatarProfile | null;
  level: number;
  xp: number;
  affinity: number;        // 0..100
  streak: number;
  bestStreak: number;
  pact: PactType;
  pactConfigured: boolean;
  weekStartIso: string;    // monday iso date
  exercises: Exercise[];
  history: DailyLog[];
  todayLog: DailyLog | null;
}

export const PACT_MULTIPLIER: Record<PactType, number> = {
  progresion: 1.10,
  mantener: 1.0,
  reducir: 0.7,
  descarga: 0.9,
};

export const PACT_LABEL: Record<PactType, string> = {
  progresion: "Progresión recomendada",
  mantener: "Mantener pacto",
  reducir: "Reducir pacto",
  descarga: "Semana de descarga",
};

export const RANKS: { min: number; name: string }[] = [
  { min: 1, name: "Civil" },
  { min: 2, name: "Aspirante" },
  { min: 3, name: "Cazador E" },
  { min: 4, name: "Cazador D" },
  { min: 5, name: "Cazador C" },
  { min: 7, name: "Cazador B" },
  { min: 10, name: "Cazador A" },
  { min: 15, name: "Cazador S" },
  { min: 20, name: "Monarca" },
];

// XP necesario acumulado para alcanzar cada nivel (índice = nivel-1)
export const XP_THRESHOLDS = [
  0, 500, 1200, 2000, 3000, 4200, 5600, 7200, 9000, 11000,
  13200, 15600, 18200, 21000, 24000, 27200, 30600, 34200, 38000, 42000,
];

export function rankFor(level: number) {
  let r = RANKS[0].name;
  for (const x of RANKS) if (level >= x.min) r = x.name;
  return r;
}

export function levelFromXp(xp: number) {
  let lvl = 1;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) {
    if (xp >= XP_THRESHOLDS[i]) lvl = i + 1;
  }
  return lvl;
}

export function nextLevelXp(level: number) {
  return XP_THRESHOLDS[Math.min(level, XP_THRESHOLDS.length - 1)] ?? XP_THRESHOLDS.at(-1)!;
}

export function avatarPhase(affinity: number) {
  if (affinity <= 20) return 1;
  if (affinity <= 40) return 2;
  if (affinity <= 60) return 3;
  if (affinity <= 80) return 4;
  return 5;
}

export const PHASE_LABEL = ["", "Distante", "Profesional", "Compañero", "Cercano", "Élite"];

export const DEFAULT_EXERCISES: Exercise[] = [
  { id: "squat", name: "Sentadillas", target: 20, unit: "reps" },
  { id: "pushup", name: "Flexiones", target: 10, unit: "reps" },
  { id: "core", name: "Core / Dead bug", target: 20, unit: "reps" },
  { id: "plank", name: "Plancha", target: 30, unit: "sec" },
  { id: "cardio", name: "Caminata / cardio ligero", target: 5, unit: "min" },
];
