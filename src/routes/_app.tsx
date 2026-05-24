import { createFileRoute, Link, Outlet, Navigate, useLocation } from "@tanstack/react-router";
import { useGame } from "@/lib/game/store";

export const Route = createFileRoute("/_app")({ component: AppShell });

const NAV = [
  { to: "/dashboard", label: "Inicio", icon: "◈" },
  { to: "/quest", label: "Misión", icon: "⚔" },
  { to: "/pact", label: "Pacto", icon: "✦" },
  { to: "/history", label: "Historial", icon: "≡" },
  { to: "/avatar", label: "Avatar", icon: "☉" },
  { to: "/inventory", label: "Items", icon: "▣" },
] as const;

function AppShell() {
  const { state } = useGame();
  const loc = useLocation();
  if (!state.profile) return <Navigate to="/onboarding/profile" />;
  if (!state.avatar) return <Navigate to="/onboarding/avatar" />;

  return (
    <div className="min-h-screen relative z-10">
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/70 border-b border-border/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/dashboard" className="font-display text-lg tracking-widest">
            <span className="text-neon">MAX</span>LEVELING
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map((n) => {
              const active = loc.pathname.startsWith(n.to);
              return (
                <Link key={n.to} to={n.to}
                  className={`px-3 py-1.5 rounded-md text-xs uppercase tracking-widest transition
                    ${active ? "text-primary bg-primary/10 border border-primary/40" : "text-muted-foreground hover:text-primary"}`}>
                  <span className="mr-1">{n.icon}</span>{n.label}
                </Link>
              );
            })}
          </nav>
          <div className="text-xs text-muted-foreground hidden sm:block">
            Nv. <span className="text-neon font-display">{state.level}</span> · XP {state.xp}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 pb-28 md:pb-10">
        <Outlet />
      </main>

      {/* Bottom nav móvil */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 border-t border-border/60 bg-background/90 backdrop-blur">
        <div className="grid grid-cols-6">
          {NAV.map((n) => {
            const active = loc.pathname.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to}
                className={`py-2.5 text-center text-[10px] uppercase tracking-widest
                  ${active ? "text-primary" : "text-muted-foreground"}`}>
                <div className="text-base">{n.icon}</div>{n.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
