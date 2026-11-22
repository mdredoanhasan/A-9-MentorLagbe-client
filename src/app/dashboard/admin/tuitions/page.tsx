"use client";

import { Button } from "@/components/ui/button";
import { api, runAction } from "@/app/lib/api";
import { useApi } from "@/app/lib/use-api";
import {
  dashboardOutlineButton,
  dashboardPrimaryButton,
  PageHeader,
  SimpleTable,
  StatusBadge,
} from "../../ui";
import { Tuition } from "@/components/type";


export default function AdminTuitions() {
  const { data, loading, reload } = useApi<Tuition[]>("/api/admin/tuitions");

  const decide = (id: string, approvalStatus: "approved" | "rejected") =>
    runAction(
      () => api(`/api/admin/tuitions/${id}/approval`, { method: "PATCH", body: JSON.stringify({ approvalStatus }) }),
      `Tuition ${approvalStatus}.`,
      reload
    );

  return (
    <div className="space-y-6">
      <PageHeader title="Tuition approval" subtitle="Review posts submitted by tutors." />
      <SimpleTable<Tuition>
        rows={data}
        loading={loading}
        empty="No tuition posts yet."
        columns={[
          { header: "Title", cell: (tuition) => <span className="font-medium">{tuition.title}</span> },
          {
            header: "Tutor",
            cell: (tuition) => (
              <div>
                <p>{tuition.tutorName}</p>
                <p className="text-xs text-slate-500">{tuition.tutorEmail}</p>
              </div>
            ),
          },
          { header: "Subject", cell: (tuition) => tuition.subject },
          { header: "Fee", cell: (tuition) => `৳${tuition.monthlyFee}` },
          { header: "Approval", cell: (tuition) => <StatusBadge status={tuition.approvalStatus} /> },
          {
            header: "Actions",
            cell: (tuition) => (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className={dashboardPrimaryButton}
                  disabled={tuition.approvalStatus === "approved"}
                  onClick={() => decide(tuition._id, "approved")}
                >
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={dashboardOutlineButton}
                  disabled={tuition.approvalStatus === "rejected"}
                  onClick={() => decide(tuition._id, "rejected")}
                >
                  Reject
                </Button>
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}