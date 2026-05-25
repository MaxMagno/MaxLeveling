import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { applyEventsAfterDaily } from "./events";
import {
  applyMissionRewards, computeStreakAfterMission, todayRestUsed,
  useItem as executeUseItem,
} from "./items";
import { migrateHydratedState } from "./migrate";
import {
  DEFAULT_EFFECTS, DEFAULT_EVENTS, DEFAULT_INVENTORY,
} from "./mock";
import {
  DEFAULT_EXERCISES, PACT_MULTIPLIER, levelFromXp,
  type AvatarProfile, type DailyLog, type GameState, type ItemId, type PactType,
  type SubmitDailyResult, type UseItemResult, type UserProfile,
} from "./types";

const KEY = "maxleveling:v1";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function mondayIso(d = new Date()) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0=Mon
  date.setDate(date.getDate() - day);
  return date.toISOString().slice(0, 10);
}

const initialState: GameState = {
  profile: null,
  avatar: null,
  level: 1,
  xp: 0,
  affinity: 10,
  streak: 0,
  bestStreak: 0,
  pact: "mantener",
  pactConfigured: false,
  weekStartIso: mondayIso(),
  exercises: DEFAULT_EXERCISES,
  history: [],
  todayLog: null,
  events: DEFAULT_EVENTS,
  inventory: DEFAULT_INVENTORY,
  effects: DEFAULT_EFFECTS,
};

interface Ctx {
  state: GameState;
  setProfile: (p: UserProfile) => void;
  setAvatar: (a: AvatarProfile) => void;
  setPact: (p: PactType) => void;
  submitDaily: (values: Record<string, number>) => SubmitDailyResult;
  useItem: (itemId: ItemId) => UseItemResult;
  useRestPass: () => UseItemResult;
  reset: () => void;
}

const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        setState(migrateHydratedState(JSON.parse(raw) as Partial<GameState>, initialState));
      }
    } catch {/* noop */}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const api = useMemo<Ctx>(() => ({
    state,
    setProfile: (p) => setState((s) => ({ ...s, profile: p })),
    setAvatar: (a) => setState((s) => ({ ...s, avatar: a })),
    setPact: (p) => setState((s) => ({ ...s, pact: p, pactConfigured: true, weekStartIso: mondayIso() })),
    submitDaily: (values) => {
      const today = todayKey();
      if (todayRestUsed(state.history, today) || state.todayLog?.restAuthorized) {
        const blocked: DailyLog = {
          date: today,
          values: {},
          completed: false,
          failed: false,
          xpEarned: 0,
          affinityEarned: 0,
          restAuthorized: true,
        };
        return {
          log: state.todayLog ?? blocked,
          eventCompletions: [],
          itemMessages: ["Hoy es descanso autorizado. No puedes registrar misión."],
        };
      }

      const mult = PACT_MULTIPLIER[state.pact];
      const ratios = state.exercises.map((ex) => {
        const v = Number(values[ex.id] ?? 0);
        return v / ex.target;
      });
      const avg = ratios.reduce((a, b) => a + b, 0) / ratios.length;
      const completed = ratios.every((r) => r >= 1);

      let bonus = 0;
      if (completed) {
        const extra = avg - 1;
        if (extra >= 1) bonus = 150;
        else if (extra >= 0.5) bonus = 60;
        else if (extra >= 0.25) bonus = 25;
      }
      const baseXp = completed ? Math.round(100 * mult + bonus) : 0;
      const baseAff = completed ? 5 : -3;

      const rewards = applyMissionRewards(
        completed,
        baseXp,
        baseAff,
        state.streak,
        state.affinity,
        state.effects,
      );

      const log: DailyLog = {
        date: today,
        values,
        completed,
        failed: !completed,
        xpEarned: rewards.xpEarned,
        affinityEarned: rewards.affinityEarned,
      };

      const history = [...state.history.filter((h) => h.date !== log.date), log];
      const { events, inventory, completions } = applyEventsAfterDaily(
        { ...state, effects: rewards.effects },
        history,
      );

      const streak = computeStreakAfterMission(
        completed,
        state.streak,
        rewards.streakShieldUsed,
      );

      setState((s) => {
        const xp = Math.max(0, s.xp + log.xpEarned);
        const level = levelFromXp(xp);
        const bestStreak = Math.max(s.bestStreak, streak);
        const affinity = Math.max(0, Math.min(100, s.affinity + log.affinityEarned));
        return {
          ...s,
          history,
          xp,
          level,
          streak,
          bestStreak,
          affinity,
          todayLog: log,
          events,
          inventory,
          effects: rewards.effects,
        };
      });
      return {
        log,
        eventCompletions: completions,
        itemMessages: rewards.messages,
      };
    },
    useItem: (itemId) => {
      const today = todayKey();
      const { next, result } = executeUseItem(state, itemId, today);
      if (result.ok) {
        setState((s) => ({ ...s, ...next }));
      }
      return result;
    },
    useRestPass: () => {
      const today = todayKey();
      const { next, result } = executeUseItem(state, "rest_pass", today);
      if (result.ok) {
        setState((s) => ({ ...s, ...next }));
      }
      return result;
    },
    reset: () => {
      localStorage.removeItem(KEY);
      setState(initialState);
    },
  }), [state]);

  // sync todayLog desde history al hidratar
  useEffect(() => {
    if (!hydrated) return;
    const t = state.history.find((h) => h.date === todayKey()) ?? null;
    if (t !== state.todayLog) setState((s) => ({ ...s, todayLog: t }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return <GameCtx.Provider value={api}>{children}</GameCtx.Provider>;
}

export function useGame() {
  const ctx = useContext(GameCtx);
  if (!ctx) throw new Error("useGame fuera de GameProvider");
  return ctx;
}
