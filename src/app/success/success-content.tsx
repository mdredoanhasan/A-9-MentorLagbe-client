"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type VerificationState =
  | { status: "loading" }
  | { status: "success"; role: string; plan: string }
  | { status: "error"; message: string };

type VerificationResponse = {
  success?: boolean;
  role?: string;
  plan?: string;
  error?: string;
};

export default function CheckoutSuccess({
  sessionId,
}: {
  sessionId?: string;
}) {
  const [verification, setVerification] = useState<VerificationState>({
    status: "loading",
  });

  useEffect(() => {
    if (!sessionId) return;

    const abortController = new AbortController();
    fetch("/api/checkout_sessions/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      body: JSON.stringify({ sessionId }),
      signal: abortController.signal,
    })
      .then(async (response) => {
        const result = (await response.json()) as VerificationResponse;
        if (!response.ok || !result.success || !result.role || !result.plan) {
          throw new Error(result.error || "We could not verify your payment.");
        }
        setVerification({
          status: "success",
          role: result.role,
          plan: result.plan,
        });
      })
      .catch((error: unknown) => {
        if (abortController.signal.aborted) return;
        setVerification({
          status: "error",
          message:
            error instanceof Error
              ? error.message
              : "We could not verify your payment. Please try again.",
        });
      });

    return () => abortController.abort();
  }, [sessionId]);

  const displayedVerification: VerificationState = sessionId
    ? verification
    : {
        status: "error",
        message: "We could not find a Stripe checkout session to verify.",
      };
  const dashboardHref =
    displayedVerification.status === "success" && displayedVerification.role === "tutor"
      ? "/dashboard/tutor"
      : "/dashboard/student";

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#faf8f4] px-6 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-[#e3e5f5] bg-white p-8 text-center shadow-sm sm:p-10">
        {displayedVerification.status === "loading" ? (
          <>
            <div className="mx-auto size-14 animate-pulse rounded-full bg-[#e8eafb]" />
            <h1 className="mt-5 font-(family-name:--font-fraunces) text-3xl font-bold text-[#101535]">
              Confirming your payment
            </h1>
            <p className="mt-3 text-slate-500">
              We are securely checking the payment with Stripe.
            </p>
          </>
        ) : displayedVerification.status === "success" ? (
          <>
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-50 text-2xl font-bold text-emerald-700">
              ✓
            </span>
            <h1 className="mt-5 font-(family-name:--font-fraunces) text-3xl font-bold text-[#101535]">
              You are now on Pro
            </h1>
            <p className="mt-3 text-slate-600">
              Your {displayedVerification.role} Pro plan is active. Thank you for your
              payment.
            </p>
            <Button
              nativeButton={false}
              render={<Link href={dashboardHref} />}
              className="mt-7 bg-[#1e2a78] text-white hover:bg-[#161f5c]"
            >
              Go to your dashboard
            </Button>
          </>
        ) : (
          <>
            <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-50 text-2xl font-bold text-amber-700">
              !
            </span>
            <h1 className="mt-5 font-(family-name:--font-fraunces) text-3xl font-bold text-[#101535]">
              Payment not confirmed yet
            </h1>
            <p role="alert" className="mt-3 text-slate-600">
              {displayedVerification.message}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              If Stripe charged you, sign in with the same account and contact
              support. Your plan will not be activated until payment is verified.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Button
                nativeButton={false}
                render={<Link href="/" />}
                className="bg-[#1e2a78] text-white hover:bg-[#161f5c]"
              >
                Back to MentorLagbe
              </Button>
              <Button
                nativeButton={false}
                render={<Link href="/sign-in" />}
                variant="outline"
              >
                Sign in
              </Button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
