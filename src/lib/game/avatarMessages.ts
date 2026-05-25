import { avatarPhase, type ItemId, type PactType } from "./types";

export type AvatarActionType =
  | "app_start"
  | "mission_completed"
  | "mission_failed"
  | "mission_bonus"
  | "streak_milestone"
  | "event_completed"
  | "item_earned"
  | "item_used"
  | "rest_pass_used"
  | "affinity_multiplier_used"
  | "streak_shield_used"
  | "xp_bonus_used"
  | "weekly_progression_accepted"
  | "weekly_maintenance_selected"
  | "weekly_reduction_selected"
  | "weekly_download_selected"
  | "body_checkin_first"
  | "body_checkin_positive"
  | "body_checkin_neutral"
  | "body_checkin_negative";

export type CheckinResultTone = "first" | "positive" | "neutral" | "negative";

type Phase = 1 | 2 | 3 | 4 | 5;

export interface AvatarMessageContext {
  affinity: number;
  phase?: Phase;
  actionType: AvatarActionType;
  streak?: number;
  userName?: string;
  eventName?: string;
  itemName?: string;
  pactChoice?: PactType;
  completed?: boolean;
  bonusAchieved?: boolean;
  itemUsed?: ItemId;
  itemEarned?: ItemId;
  checkinResult?: CheckinResultTone;
  restAuthorized?: boolean;
}

function p(
  f1: string, f2: string, f3: string, f4: string, f5: string,
): Record<Phase, string> {
  return { 1: f1, 2: f2, 3: f3, 4: f4, 5: f5 };
}

const BANK: Record<AvatarActionType, Record<Phase, string>> = {
  app_start: p(
    "Misión diaria activada. El sistema te observa. Demuestra constancia.",
    "El sistema está en línea. Hoy puedes sumar progreso real.",
    "Buen momento para registrar tu misión. Te leo con atención.",
    "Me alegra verte activo/a. Vamos a sumar un día más de nivel.",
    "Cada día que entras, confirmas que sigues en el camino correcto.",
  ),
  mission_completed: p(
    "Misión completada. Correcto. No esperaba mucho más.",
    "Has cumplido. Empiezas a parecer alguien constante.",
    "Buen trabajo. Hoy sí has estado a la altura.",
    "Estoy orgulloso/a de tu progreso. Sigue así.",
    "Cada misión que completas confirma algo: ya no eres el mismo de antes.",
  ),
  mission_failed: p(
    "Misión fallida. El sistema registra tu falta de disciplina.",
    "Hoy has fallado. Mañana toca corregir.",
    "Un fallo no define tu progreso. Pero repetirlo sí.",
    "No me gusta verte caer, pero me importa más que vuelvas.",
    "Has fallado hoy. Bien. Entonces mañana me demuestras quién eres.",
  ),
  mission_bonus: p(
    "Objetivo superado. El sistema reconoce el esfuerzo extra.",
    "Bonus detectado. Vas por encima del mínimo. Bien.",
    "Esfuerzo por encima del pacto. Eso suma XP de verdad.",
    "Has ido más allá del objetivo. Eso es mentalidad de cazador.",
    "Bonus máximo. Hoy has entrenado como alguien que quiere subir de nivel.",
  ),
  streak_milestone: p(
    "Racha en curso. No la desperdicies.",
    "Tu racha sigue viva. Mantén el ritmo.",
    "Constancia detectada. La racha habla bien de ti.",
    "Esta racha demuestra disciplina. Me gusta lo que veo.",
    "Cada día de racha refuerza quién estás llegando a ser.",
  ),
  event_completed: p(
    "Evento completado. Recompensa desbloqueada.",
    "Evento completado. Buen movimiento estratégico.",
    "Has cerrado un evento. El sistema te recompensa.",
    "Evento superado. Así se construye un cazador completo.",
    "Otro evento en tu haber. Tu progreso se nota en el sistema.",
  ),
  item_earned: p(
    "Has ganado un item. Úsalo con inteligencia.",
    "Item en inventario. No lo guardes por miedo.",
    "Recompensa obtenida. Úsala en el momento correcto.",
    "Nuevo recurso disponible. Piensa antes de activarlo.",
    "Item desbloqueado. Es una herramienta, no un trofeo.",
  ),
  item_used: p(
    "Item activado. El sistema registrará el efecto.",
    "Recurso desplegado. Que cuente para tu progreso.",
    "Has usado un item. Juega con cabeza.",
    "Efecto en marcha. Confío en que sabes por qué lo hiciste.",
    "Item activado. Haz que esta decisión valga la pena.",
  ),
  rest_pass_used: p(
    "Descanso autorizado. Incluso los cazadores inteligentes saben cuándo recuperar.",
    "Descanso registrado. Recupera sin culpa, vuelve con foco.",
    "Pase de descanso activo. Cuida el cuerpo para volver fuerte.",
    "Descanso autorizado. Tu constancia también necesita pausa.",
    "Has elegido recuperar. Eso también es disciplina.",
  ),
  affinity_multiplier_used: p(
    "Multiplicador de afinidad activo. La próxima victoria contará doble.",
    "Mult. de afinidad listo. Completa la misión y aprovecha el impulso.",
    "Afinidad amplificada pendiente. No lo desperdicies.",
    "El multiplicador espera tu próxima misión completada.",
    "Afinidad x2 preparada. Haz que la próxima misión brille.",
  ),
  streak_shield_used: p(
    "Escudo de racha preparado. Un fallo no te tumbará.",
    "Protección de racha activa. Un error no lo arruina todo.",
    "Escudo listo. Puedes arriesgar sin perder la racha.",
    "Tu racha tiene red de seguridad. Úsala con criterio.",
    "Escudo activo. Falla si debes, pero la racha resistirá una vez.",
  ),
  xp_bonus_used: p(
    "Bonus XP +50 activo. La próxima misión sumará más.",
    "+50 XP pendiente. Completa la misión para cobrarlo.",
    "Bonus XP preparado. No dejes la misión a medias.",
    "XP extra en cola. Cierra la misión y cobra.",
    "Bonus XP listo. La próxima victoria te subirá de nivel antes.",
  ),
  weekly_progression_accepted: p(
    "Pacto de progresión aceptado. El sistema subirá el listón con cuidado.",
    "Progresión saludable activada. Más XP, más exigencia.",
    "Has elegido avanzar. Respeto la decisión.",
    "Progresión activa. Demuestra que puedes con más.",
    "Pacto de crecimiento sellado. Vamos a por una gran semana.",
  ),
  weekly_maintenance_selected: p(
    "Pacto de mantenimiento. Estabilidad antes que presión.",
    "Mantener ritmo. Constancia pura.",
    "Mismo nivel de exigencia. Perfecto para consolidar.",
    "Mantienes el pacto. Eso también es madurez.",
    "Ritmo estable elegido. Domina la base antes de subir.",
  ),
  weekly_reduction_selected: p(
    "Pacto reducido. Menos XP, pero menos presión.",
    "Has bajado el pacto. Úsalo para recuperar control.",
    "Reducción activa. No confundas descanso con abandono.",
    "Pacto más ligero. Vuelve cuando estés listo/a.",
    "Has elegido bajar el ritmo. Hazlo con intención, no con excusas.",
  ),
  weekly_download_selected: p(
    "Semana de descarga. Recuperación sin rendirse.",
    "Descarga activa. Cuida el cuerpo, mantén el hábito.",
    "Ritmo de recuperación. El sistema lo autoriza.",
    "Semana más suave. Recarga para volver fuerte.",
    "Descarga elegida. Escucha al cuerpo y vuelve con claridad.",
  ),
  body_checkin_first: p(
    "Registro corporal inicial completado. A partir de ahora, el sistema medirá tu evolución.",
    "Primer check-in guardado. Tu línea base ya está en el sistema.",
    "Registro inicial hecho. Mediremos tu progreso mes a mes.",
    "Check-in inicial completado. Tu evolución empieza a tener datos.",
    "Base corporal registrada. A partir de aquí, todo es progreso medible.",
  ),
  body_checkin_positive: p(
    "Se nota el trabajo. Tu cuerpo está respondiendo. Estás construyendo algo real.",
    "Tus métricas mejoran. La disciplina deja huella.",
    "Progreso corporal claro. Sigue construyendo.",
    "El cuerpo responde. Estoy viendo a alguien constante.",
    "Evolución real. Tu esfuerzo se refleja fuera del espejo.",
  ),
  body_checkin_neutral: p(
    "Puede que el espejo tarde, pero tus hábitos ya cambiaron. Sigue.",
    "Cambios modestos, constancia sólida. Eso también cuenta.",
    "El progreso no siempre es dramático. Sigue empujando.",
    "Hábitos fuertes aunque las cifras no griten. Continúa.",
    "Constancia por encima del drama. El sistema sigue contigo.",
  ),
  body_checkin_negative: p(
    "No voy a maquillarlo: este mes no avanzaste como podías. Pero aún estás dentro del sistema. Reinicia.",
    "Mes flojo en datos. Ajusta el enfoque y vuelve al pacto.",
    "Los números no ayudan este mes. Tu respuesta define el siguiente.",
    "Retroceso registrado. No te fueras: corrige el rumbo.",
    "Mes difícil. Aún puedes revertirlo. El sistema no te ha dado de baja.",
  ),
};

const ITEM_USED_ACTION: Record<ItemId, AvatarActionType> = {
  rest_pass: "rest_pass_used",
  xp_bonus_50: "xp_bonus_used",
  affinity_mult: "affinity_multiplier_used",
  streak_shield: "streak_shield_used",
};

const PACT_ACTION: Record<PactType, AvatarActionType> = {
  progresion: "weekly_progression_accepted",
  mantener: "weekly_maintenance_selected",
  reducir: "weekly_reduction_selected",
  descarga: "weekly_download_selected",
};

const CHECKIN_ACTION: Record<CheckinResultTone, AvatarActionType> = {
  first: "body_checkin_first",
  positive: "body_checkin_positive",
  neutral: "body_checkin_neutral",
  negative: "body_checkin_negative",
};

function interpolate(text: string, ctx: AvatarMessageContext): string {
  return text
    .replace(/\{name\}/g, ctx.userName ?? "Cazador")
    .replace(/\{streak\}/g, String(ctx.streak ?? 0))
    .replace(/\{eventName\}/g, ctx.eventName ?? "Evento")
    .replace(/\{itemName\}/g, ctx.itemName ?? "Item");
}

export function getAvatarMessage(ctx: AvatarMessageContext): string {
  const phase = (ctx.phase ?? avatarPhase(ctx.affinity)) as Phase;
  const table = BANK[ctx.actionType];
  return interpolate(table[phase] ?? table[3], ctx);
}

export function pactToAvatarAction(pact: PactType): AvatarActionType {
  return PACT_ACTION[pact];
}

export function itemUsedToAvatarAction(itemId: ItemId): AvatarActionType {
  return ITEM_USED_ACTION[itemId] ?? "item_used";
}

export function checkinToneToAction(tone: CheckinResultTone): AvatarActionType {
  return CHECKIN_ACTION[tone];
}

/** Tono corporal para el motor de frases (check-in mensual). */
export function resolveCheckinTone(
  previous: { weightKg: number; muscleMassValue: number; muscleMassUnit: string } | undefined,
  weightDelta: number | undefined,
  muscleDelta: number | undefined,
  consistent: boolean,
): CheckinResultTone {
  if (!previous) return "first";

  const w = weightDelta ?? 0;
  const m = muscleDelta ?? 0;

  if (muscleDelta !== undefined && m <= -0.3) return "negative";
  if (w >= 1.5 && (muscleDelta === undefined || m <= 0)) return "negative";

  if (muscleDelta !== undefined && m >= 0.3) return "positive";
  if (w <= -0.3 && (muscleDelta === undefined || m >= -0.2)) return "positive";

  if (Math.abs(w) < 0.5 && (muscleDelta === undefined || Math.abs(m) < 0.5) && consistent) {
    return "neutral";
  }
  if (consistent) return "neutral";
  return "negative";
}

export function bodyCheckinAvatarMessage(
  affinity: number,
  previous: { weightKg: number; muscleMassValue: number; muscleMassUnit: string } | undefined,
  weightDelta: number | undefined,
  muscleDelta: number | undefined,
  consistent: boolean,
): string {
  const tone = resolveCheckinTone(previous, weightDelta, muscleDelta, consistent);
  return getAvatarMessage({ affinity, actionType: checkinToneToAction(tone) });
}

const STREAK_MILESTONES = [3, 7, 14, 21, 30];

export function isStreakMilestone(streak: number): boolean {
  return STREAK_MILESTONES.includes(streak);
}

export function resolveDashboardAction(
  affinity: number,
  streak: number,
  todayLog: { completed?: boolean; failed?: boolean; restAuthorized?: boolean; xpEarned?: number } | null,
): AvatarActionType {
  if (todayLog?.restAuthorized) return "rest_pass_used";
  if (todayLog?.completed) {
    if ((todayLog.xpEarned ?? 0) >= 150) return "mission_bonus";
    return "mission_completed";
  }
  if (todayLog?.failed) return "mission_failed";
  if (isStreakMilestone(streak)) return "streak_milestone";
  return "app_start";
}
