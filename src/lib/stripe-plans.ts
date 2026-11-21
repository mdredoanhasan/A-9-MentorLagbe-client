import "server-only";

export type ProPlanId = "pro-tutor" | "pro-student";
export type PlanRole = "tutor" | "student";

type ProPlan = {
  id: ProPlanId;
  role: PlanRole;
  priceId: string;
  legacyPriceId?: string;
};

const defaultTutorPriceId = "price_1Ue5pBJuiVoHX8wwKr048q8k";
const legacyTutorPriceId = process.env.STRIPE_MENTOR_PRO_PRICE_ID || defaultTutorPriceId;

const plans: Record<ProPlanId, ProPlan> = {
  "pro-tutor": {
    id: "pro-tutor",
    role: "tutor",
    priceId:
      process.env.STRIPE_TUTOR_PRO_PRICE_ID ||
      legacyTutorPriceId,
    legacyPriceId: legacyTutorPriceId,
  },
  "pro-student": {
    id: "pro-student",
    role: "student",
    priceId:
      process.env.STRIPE_STUDENT_PRO_PRICE_ID ||
      "price_1Ue5qRJuiVoHX8wwM7SZmozg",
  },
};

export function getProPlan(planId: string): ProPlan | null {
  if (planId === "pro-mentor") return plans["pro-tutor"];
  if (planId !== "pro-tutor" && planId !== "pro-student") return null;
  return plans[planId];
}

export function getProPlanPriceId(planId: string | undefined, plan: ProPlan): string {
  if (planId === "pro-mentor") return plan.legacyPriceId ?? plan.priceId;
  return plan.priceId;
}

export function normalizePlanRole(role: unknown): PlanRole | null {
  if (role === "mentor" || role === "tutor") return "tutor";
  if (role === "student") return "student";
  return null;
}
