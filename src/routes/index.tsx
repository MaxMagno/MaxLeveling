import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useGame } from "@/lib/game/store";

export const Route = createFileRoute("/")({ component: Index });

function Index() {
  const { state } = useGame();
  if (!state.profile) return <Navigate to="/onboarding/profile" />;
  if (!state.avatar) return <Navigate to="/onboarding/avatar" />;
  if (!state.pactConfigured) return <Navigate to="/onboarding/pact" />;
  return <Navigate to="/dashboard" />;
}
