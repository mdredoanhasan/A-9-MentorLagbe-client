import "server-only";

export type ProPlanId = "pro-mentor" | "pro-student";
export type PlanRole = "mentor" | "student";

type ProPlan = {
  id: ProPlanId;
  role: PlanRole;
  priceId: string;
};

const plans: Record<ProPlanId, ProPlan> = {
  "pro-mentor": {
    id: "pro-mentor",
    role: "mentor",
    priceId:
      process.env.STRIPE_MENTOR_PRO_PRICE_ID ||
      "price_1Ue5pBJuiVoHX8wwKr048q8k",
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
  if (planId !== "pro-mentor" && planId !== "pro-student") return null;
  return plans[planId];
}

export function normalizePlanRole(role: unknown): PlanRole | null {
  if (role === "mentor" || role === "tutor") return "mentor";
  if (role === "student") return "student";
  return null;
}
