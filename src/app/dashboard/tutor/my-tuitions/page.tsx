"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { api, runAction } from "@/app/lib/api";
import { useApi } from "@/app/lib/use-api";
import { TuitionForm, TuitionValues } from "../../TuitionForm";
import { Tuition } from "@/components/type";
import {
  dashboardDestructiveButton,
  dashboardOutlineButton,
  PageHeader,
  SimpleTable,
  StatusBadge,
} from "../../ui";
import { toast } from "sonner";


export default function MyTuitions() {
  const { data, loading, reload } = useApi<Tuition[]>("/api/tutor/tuitions");
  const [editing, setEditing] = useState<Tuition | null>(null);

  const patch = (id: string, body: object, msg: string) =>
    runAction(() => api(`/api/tuitions/${id}`, { method: "PATCH", body: JSON.stringify(body) }), msg, reload);

  const remove = (id: string) => {
    if (!confirm("Delete this tuition?")) return;
    runAction(() => api(`/api/tuitions/${id}`, { method: "DELETE" }), "Tuition deleted.", reload);
  };

  async function saveEdit(values: TuitionValues) {
    if (!editing) return;
    await api(`/api/tuitions/${editing._id}`, {
      method: "PATCH",
      body: JSON.stringify({
        ...values,
        monthlyFee: Number(values.monthlyFee),
        daysPerWeek: Number(values.daysPerWeek),
      }),
    });
    setEditing(null);
    reload();
    toast.success("Tuition updated.");
  }

  return (
    <div className="space-y-6">
      <PageHeader title="My tuitions" subtitle="Edit, close or delete your posts." />

      <SimpleTable<Tuition>
        rows={data}
        loading={loading}
        empty="You haven't posted any tuition yet."
        columns={[
          { header: "Title", cell: (tuition) => <span className="font-medium">{tuition.title}</span> },
          { header: "Subject", cell: (tuition) => tuition.subject },
          { header: "Fee", cell: (tuition) => `৳${tuition.monthlyFee}` },
          { header: "Approval", cell: (tuition) => <StatusBadge status={tuition.approvalStatus} /> },
          { header: "Status", cell: (tuition) => <StatusBadge status={tuition.status} /> },
          {
            header: "Actions",
            cell: (tuition) => (
              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" className={dashboardOutlineButton} onClick={() => setEditing(tuition)}>Edit</Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={dashboardOutlineButton}
                  onClick={() =>
                    patch(tuition._id, { status: tuition.status === "active" ? "closed" : "active" }, "Status updated.")
                  }
                >
                  {tuition.status === "active" ? "Close" : "Reopen"}
                </Button>
                <Button size="sm" variant="outline" className={dashboardDestructiveButton} onClick={() => remove(tuition._id)}>
                  Delete
                </Button>
              </div>
            ),
          },
        ]}
      />

      <Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-[#e3e5f5] bg-white text-[#101535] dark:border-[#e3e5f5] dark:bg-white dark:text-[#101535] sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit tuition</DialogTitle>
          </DialogHeader>
          {editing && (
            <TuitionForm
              submitLabel="Save changes"
              onSubmit={saveEdit}
              initial={{
                ...editing,
                monthlyFee: String(editing.monthlyFee),
                daysPerWeek: String(editing.daysPerWeek),
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}