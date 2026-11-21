"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { useState } from "react";

type Plan = {
  id: string;
  role?: "mentor" | "student";
  name: string;
  description: string;
  price: number;
  note: string;
  features: string[];
  cta: string;
  href?: string;
  highlighted?: boolean;
};

const groups: { heading: string; plans: Plan[] }[] = [
  {
    heading: "For Mentors",
    plans: [
      {
        id: "free-mentor",
        name: "Free",
        description: "Start listing and meet your first students.",
        price: 0,
        note: "forever",
        features: [
          "Post up to 2 tuitions",
          "Receive and manage applications",
          "Accept or reject applicants",
        ],
        cta: "Get started free",
        href: "/sign-up",
      },
      {
        id: "pro-mentor",
        role: "mentor",
        name: "Pro Mentor",
        description: "Grow without a cap on your listings.",
        price: 15,
        note: "one-time, USD",
        features: [
          "Unlimited tuition posts",
          "Everything in Free",
          "Pro badge on your profile",
        ],
        cta: "Get Pro",
        highlighted: true,
      },
    ],
  },
  {
    heading: "For Students",
    plans: [
      {
        id: "free-student",
        name: "Free",
        description: "Everything you need to find a mentor.",
        price: 0,
        note: "forever",
        features: [
          "Browse and filter all tuitions",
          "Apply with your preferred schedule",
          "Track every application",
        ],
        cta: "Get started free",
        href: "/sign-up",
      },
      {
        id: "pro-student",
        role: "student",
        name: "Pro Student",
        description: "Support the platform and stand out.",
        price: 10,
        note: "one-time, USD",
        features: ["Everything in Free", "Pro badge on your profile"],
        cta: "Get Pro",
        highlighted: true,
      },
    ],
  },
];

const heading =
  "font-[family-name:var(--font-fraunces)] font-bold text-[#101535]";

function PlanCard({
  plan,
  isCheckingOut,
  isDisabled,
  onSubscribe,
}: {
  plan: Plan;
  isCheckingOut: boolean;
  isDisabled: boolean;
  onSubscribe: (planId: string) => void;
}) {
  const { highlighted } = plan;

  return (
    <div
      className={`relative flex flex-col rounded-2xl bg-white p-6 ${
        highlighted ? "border-2 border-[#1e2a78]" : "border border-gray-200"
      }`}
    >
      {highlighted && (
        <span className="absolute right-4 top-4 rounded-full bg-amber-500 px-3 py-0.5 text-xs font-medium text-[#101535]">
          Recommended
        </span>
      )}

      <h4 className={`${heading} text-xl`}>{plan.name}</h4>
      <p className="mt-1 text-sm text-slate-500">{plan.description}</p>

      <p className="mt-6 flex items-baseline gap-2">
        <span className={`${heading} text-5xl`}>${plan.price}</span>
        <span className="text-sm text-slate-500">{plan.note}</span>
      </p>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-3 text-sm text-[#101535]"
          >
            <Check size={16} className="shrink-0 text-emerald-600" />
            {feature}
          </li>
        ))}
      </ul>

      {plan.href ? (
        <Link
          href={plan.href}
          className="mt-8 rounded-xl border border-[#1e2a78] py-3 text-center font-medium text-[#1e2a78] hover:bg-[#1e2a78]/5"
        >
          {plan.cta}
        </Link>
      ) : (
        <button
          type="button"
          disabled={isDisabled}
          aria-busy={isCheckingOut}
          onClick={() => onSubscribe(plan.id)}
          className="mt-8 rounded-xl bg-amber-500 py-3 font-semibold text-[#101535] hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCheckingOut ? "Opening secure checkout..." : plan.cta}
        </button>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [pendingPlanId, setPendingPlanId] = useState("");
  const [checkoutError, setCheckoutError] = useState("");

  async function subscribe(planId: string) {
    setPendingPlanId(planId);
    setCheckoutError("");

    try {
      const response = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ planId }),
      });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };

      if (!response.ok || !result.url) {
        throw new Error(result.error || "Could not start checkout.");
      }

      window.location.assign(result.url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Could not start checkout.",
      );
      setPendingPlanId("");
    }
  }

  return (
    <section id="pricing" className="bg-[#faf8f4] py-20">
      <div className="mx-auto max-w-4xl px-6">
        {/* Heading */}
        <div className="text-center">
          <p className="text-sm uppercase tracking-wide text-slate-600">
            Pricing
          </p>
          <h1 className={`${heading} mt-2 text-4xl`}>
            Simple Plans for Mentors and Students
          </h1>
          <p className="mt-3 text-slate-500">
            Start free. Upgrade to Pro when you need more.
          </p>
        </div>

        {/* Plan groups */}
        {checkoutError && (
          <p
            role="alert"
            className="mx-auto mt-8 max-w-2xl rounded-xl bg-red-50 px-4 py-3 text-center text-sm text-red-700"
          >
            {checkoutError}
          </p>
        )}
        {groups.map((group) => (
          <div key={group.heading} className="mt-14">
            <h2 className={`${heading} text-center text-2xl`}>
              {group.heading}
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {group.plans.map((plan) => (
                <PlanCard
                  key={plan.id}
                  plan={plan}
                  isCheckingOut={pendingPlanId === plan.id}
                  isDisabled={Boolean(pendingPlanId)}
                  onSubscribe={subscribe}
                />
              ))}
            </div>
          </div>
        ))}

        <p className="mt-12 text-center">
          <Link
            href="#compare"
            className="font-medium text-[#101535] hover:underline"
          >
            Compare plans in detail
          </Link>
        </p>
      </div>
    </section>
  );
}
