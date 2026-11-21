"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { useSession } from "@/app/lib/auth-client";
import { normalizeUserRole } from "@/components/type";
import { Button } from "@/components/ui/button";

const dashboardPaths = {
  student: "/dashboard/student",
  tutor: "/dashboard/tutor",
  admin: "/dashboard/admin",
};

export default function UnauthorizedPage() {
  const { data: session, isPending } = useSession();
  const role = session?.user
    ? normalizeUserRole(session.user.role)
    : undefined;
  const roleLabel = role
    ? role.charAt(0).toUpperCase() + role.slice(1)
    : "";
  const roleArticle = role === "admin" ? "an" : "a";

  return (
    <main className="flex min-h-[65vh] items-center justify-center bg-[#faf8f4] px-6 py-16">
      <section className="w-full max-w-lg rounded-3xl border border-[#e3e5f5] bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <ShieldAlert size={28} aria-hidden="true" />
        </span>
        <p className="mt-5 text-sm font-bold tracking-[0.2em] text-red-600">
          ERROR 403
        </p>
        <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-bold text-[#101535]">
          Access denied
        </h1>
        <p className="mt-3 text-slate-600">
          {isPending
            ? "Checking your account..."
            : role
              ? `You are signed in as ${roleArticle} ${roleLabel}. This page is not available for your role.`
              : "Please sign in to open this page."}
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button
            nativeButton={false}
            render={<Link href="/" />}
            variant="outline"
          >
            Back to Home
          </Button>
          {isPending ? null : role ? (
            <Button
              nativeButton={false}
              render={<Link href={dashboardPaths[role]} />}
              className="bg-[#1e2a78] text-white hover:bg-[#161f5c]"
            >
              Go to my dashboard
            </Button>
          ) : (
            <Button
              nativeButton={false}
              render={<Link href="/sign-in" />}
              className="bg-[#1e2a78] text-white hover:bg-[#161f5c]"
            >
              Sign in
            </Button>
          )}
        </div>
      </section>
    </main>
  );
}
