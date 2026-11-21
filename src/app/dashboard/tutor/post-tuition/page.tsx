"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { api } from "@/app/lib/api";
import { useApi } from "@/app/lib/use-api";
import { TuitionValues, TuitionForm } from "../../TuitionForm";
import { PageHeader } from "../../ui";


export default function PostTuition() {
  const router = useRouter();
  const { data: stats, loading } = useApi<{ plan: "free" | "pro"; totalTuitions: number }>("/api/tutor/stats");
  const limitReached = stats?.plan === "free" && stats.totalTuitions >= 2;

  async function create(values: TuitionValues) {
    await api("/api/tuitions", {
      method: "POST",
      body: JSON.stringify({
        ...values,
        monthlyFee: Number(values.monthlyFee),
        daysPerWeek: Number(values.daysPerWeek),
        approvalStatus: "pending",
        status: "active",
      }),
    });
    toast.success("Submitted. An admin will review your tuition.");
    router.push("/dashboard/tutor/my-tuitions");
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader title="Post a tuition" subtitle="Admins review every listing before it goes public." />

      {limitReached && (
        <div className="rounded-xl bg-amber-50 p-4 text-sm text-slate-700">
          Free plan tutors can post up to 2 tuitions.{" "}
          <Link href="/pricing" className="font-semibold text-[#1e2a78] underline">
            Upgrade to Pro
          </Link>{" "}
          for unlimited posts.
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <TuitionForm submitLabel="Submit for approval" disabled={loading || limitReached} onSubmit={create} />
      </div>
    </div>
  );
}