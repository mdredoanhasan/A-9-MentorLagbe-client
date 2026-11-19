"use client";

import Link from "next/link";
import { useSession } from "@/app/lib/auth-client";

const faqs = [
  {
    question: "Is MentorLagbe free to use?",
    answer: "Yes. Students can browse and apply for free, and mentors can post up to 2 tuitions on the Free plan.",
  },
  {
    question: "How do I upgrade to Pro?",
    answer: "Sign in, then use the Subscribe with Stripe button on your plan. Payments are handled securely by Stripe.",
  },
  {
    question: "Which plan is for me?",
    answer: "Mentors choose Pro Mentor for unlimited tuition posts. Students choose Pro Student. A plan only works for the matching account type.",
  },
];

const buttonStyle =
  "rounded-xl border border-[#1e2a78] px-6 py-3 font-medium text-[#1e2a78] hover:bg-[#1e2a78]/5";

function RoleButton() {
  const { data: session, isPending } = useSession();
  const role = session?.user?.role;

  // Wait for the session so the wrong button doesn't flash
  if (isPending) return null;

  // Admin: no button
  if (role === "admin") return null;

  // Mentor: Post Tuition
  if (role === "mentor" || role === "tutor") {
    return (
      <Link href="/dashboard/tutor/post-tuition" className={buttonStyle}>
        Post Tuition
      </Link>
    );
  }

  // Student (and logged-out visitors): Browse Tuitions
  return (
    <Link href="/tuitions" className={buttonStyle}>
      Browse Tuitions
    </Link>
  );
}

export default function PricingFaq() {
  return (
    <section className="bg-[#f0ede4] py-20">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center font-[family-name:var(--font-fraunces)] text-4xl font-bold text-[#101535]">
          Pricing Questions
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {faqs.map(({ question, answer }) => (
            <div key={question} className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="font-[family-name:var(--font-fraunces)] text-lg font-bold leading-snug text-[#101535]">
                {question}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <RoleButton />
        </div>
      </div>
    </section>
  );
}