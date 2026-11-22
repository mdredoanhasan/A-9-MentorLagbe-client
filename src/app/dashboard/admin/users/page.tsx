"use client";

import { api, runAction } from "@/app/lib/api";
import { useApi } from "@/app/lib/use-api";
import { AppUser, UserRole } from "@/components/type";
import { useRole } from "../../use-role";
import { PageHeader, SimpleTable } from "../../ui";


export default function UsersPage() {
  const { data, loading, reload } = useApi<AppUser[]>("/api/admin/users");
  const { session } = useRole();

  const changeRole = (id: string, role: UserRole) =>
    runAction(
      () => api(`/api/admin/users/${id}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
      "Role updated.",
      reload
    );

  return (
    <div className="space-y-6">
      <PageHeader title="Users" subtitle="Manage roles for every account." />
      <SimpleTable<AppUser>
        rows={data}
        loading={loading}
        columns={[
          { header: "Name", cell: (user) => <span className="font-medium">{user.name}</span> },
          { header: "Email", cell: (user) => user.email },
          {
            header: "Role",
            cell: (user) => (
              <select
                value={user.role}
                disabled={user._id === session?.user?.id}
                onChange={(event) =>
                  changeRole(user._id, event.target.value as UserRole)
                }
                className="h-9 rounded-md border border-[#e3e5f5] bg-white px-2 text-sm capitalize text-[#101535] outline-none focus-visible:ring-2 focus-visible:ring-[#1e2a78] disabled:opacity-50 dark:bg-white dark:text-[#101535]"
              >
                <option value="student">Student</option>
                <option value="tutor">Tutor</option>
                <option value="admin">Admin</option>
              </select>
            ),
          },
        ]}
      />
    </div>
  );
}