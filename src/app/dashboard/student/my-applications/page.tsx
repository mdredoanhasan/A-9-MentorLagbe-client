"use client";

import { Button } from "@/components/ui/button";
import { api, runAction } from "@/app/lib/api";
import { useApi } from "@/app/lib/use-api";
import { Application } from "@/components/type";
import { PageHeader, SimpleTable, StatusBadge } from "../../ui";


export default function MyApplications() {
  const { data, loading, reload } = useApi<Application[]>("/api/student/applications");

  const cancel = (id: string) => {
    if (!confirm("Cancel this application?")) return;
    runAction(() => api(`/api/applications/${id}`, { method: "DELETE" }), "Application cancelled.", reload);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="My applications" subtitle="Tuitions you have applied for." />
      <SimpleTable<Application>
        rows={data}
        loading={loading}
        empty="You haven't applied to any tuition yet."
        columns={[
          { header: "Tuition", cell: (application) => <span className="font-medium">{application.tuitionTitle}</span> },
          {
            header: "Mentor",
            cell: (application) => (
              <div>
                <p>{application.mentorName}</p>
                <p className="text-xs text-slate-500">{application.mentorEmail}</p>
              </div>
            ),
          },
          { header: "Monthly fee", cell: (application) => `৳${application.monthlyFee}` },
          { header: "Applied", cell: (application) => new Date(application.createdAt).toLocaleDateString() },
          { header: "Status", cell: (application) => <StatusBadge status={application.status} /> },
          {
            header: "",
            cell: (application) =>
              application.status === "pending" && (
                <Button size="sm" variant="outline" className="text-red-600" onClick={() => cancel(application._id)}>
                  Cancel
                </Button>
              ),
          },
        ]}
      />
    </div>
  );
}