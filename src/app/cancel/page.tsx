import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RoleGuard } from "@/app/dashboard/RoleGuard";

export default function CheckoutCancelledPage() {
  return (
    <RoleGuard>
      <main className="flex min-h-[65vh] items-center justify-center bg-[#faf8f4] px-6 py-16">
        <section className="w-full max-w-lg rounded-3xl border border-[#e3e5f5] bg-white p-8 text-center shadow-sm sm:p-10">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-amber-50 text-2xl font-bold text-amber-700">
            ×
          </span>
          <h1 className="mt-5 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#101535]">
            Payment cancelled
          </h1>
          <p className="mt-3 text-slate-600">
            No payment was completed and your plan has not changed. You can try
            again whenever you are ready.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button
              nativeButton={false}
              render={<Link href="/#pricing" />}
              className="bg-[#1e2a78] text-white hover:bg-[#161f5c]"
            >
              View plans
            </Button>
            <Button
              nativeButton={false}
              render={<Link href="/" />}
              variant="outline"
            >
              Back to home
            </Button>
          </div>
        </section>
      </main>
    </RoleGuard>
  );
}
