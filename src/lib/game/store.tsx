import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { applyEventsAfterDaily } from "./events";
import {
  DEFAULT_EFFECTS, DEFAULT_INVENTORY, MOCK_EVENTS,
} from "./mock";
import {
  DEFAULT_EXERCISES, PACT_MULTIPLIER, levelFromXp,
  type AvatarProfile, type DailyLog, type GameState, type PactType, type UserProfile,
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
  events: MOCK_EVENTS,
  inventory: DEFAULT_INVENTORY,
  effects: DEFAULT_EFFECTS,
};

interface Ctx {
  state: GameState;
  setProfile: (p: UserProfile) => void;
  setAvatar: (a: AvatarProfile) => void;
  setPact: (p: PactType) => void;
  submitDaily: (values: Record<string, number>) => DailyLog;
  reset: () => void;
}

const GameCtx = createContext<Ctx | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
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
      const mult = PACT_MULTIPLIER[state.pact];
      // % cumplido medio frente a target
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
      const affGain = completed ? 5 : -3;

      const log: DailyLog = {
        date: todayKey(),
        values,
        completed,
        failed: !completed,
        xpEarned: baseXp,
        affinityEarned: affGain,
      };

      setState((s) => {
        const history = [...s.history.filter((h) => h.date !== log.date), log];
        const xp = Math.max(0, s.xp + log.xpEarned);
        const level = levelFromXp(xp);
        const streak = completed ? s.streak + 1 : 0;
        const bestStreak = Math.max(s.bestStreak, streak);
        const affinity = Math.max(0, Math.min(100, s.affinity + affGain));
        const { events, inventory } = applyEventsAfterDaily(s, history);
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
        };
      });
      return log;
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
