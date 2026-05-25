import { ONBOARDING_TOTAL_STEPS } from "@/lib/game/types";

export function OnboardingProgress({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div
      className="flex justify-center gap-1.5 pt-1"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={ONBOARDING_TOTAL_STEPS}
      aria-label={`Paso ${step} de ${ONBOARDING_TOTAL_STEPS}`}
    >
      {Array.from({ length: ONBOARDING_TOTAL_STEPS }, (_, i) => (
        <span
          key={i}
          className={`h-1 w-10 rounded-full transition-colors ${
            i < step ? "bg-primary" : "bg-input/60"
          }`}
        />
      ))}
    </div>
  );
}
