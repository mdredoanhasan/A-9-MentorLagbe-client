"use client";

import { Button } from "@/components/ui/button";
import { api, runAction } from "@/app/lib/api";
import { useApi } from "@/app/lib/use-api";
import { PageHeader, SimpleTable, StatusBadge } from "../../ui";
import { Application } from "@/components/type";


export default function Applicants() {
  const { data, loading, reload } = useApi<Application[]>("/api/tutor/applicants");

  const setStatus = (id: string, status: "accepted" | "rejected") =>
    runAction(
      () => api(`/api/applications/${id}`, { method: "PATCH", body: JSON.stringify({ status }) }),
      `Application ${status}.`,
      reload
    );

  return (
    <div className="space-y-6">
      <PageHeader title="Applicants" subtitle="Students who applied to your tuitions." />
      <SimpleTable<Application>
        rows={data}
        loading={loading}
        empty="No applications yet."
        columns={[
          { header: "Student", cell: (application) => <span className="font-medium">{application.studentName}</span> },
          { header: "Email", cell: (application) => application.studentEmail },
          { header: "Phone", cell: (application) => application.phone },
          { header: "Schedule", cell: (application) => application.schedule },
          { header: "Note", cell: (application) => <span className="line-clamp-2 max-w-48">{application.note}</span> },
          { header: "Tuition", cell: (application) => application.tuitionTitle },
          {
            header: "Status",
            cell: (application) =>
              application.status === "pending" ? (
                <div className="flex gap-2">
                  <Button size="sm" className="bg-[#1e2a78] text-white" onClick={() => setStatus(application._id, "accepted")}>
                    Accept
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setStatus(application._id, "rejected")}>
                    Reject
                  </Button>
                </div>
              ) : (
                <StatusBadge status={application.status} />
              ),
          },
        ]}
      />
    </div>
  );
}