"use client";

import { Users, GraduationCap, ShieldCheck, DollarSign, CreditCard } from "lucide-react";
import { StatsOverview } from "../ui";


type Stats = {
  totalUsers: number; totalTutors: number;
  pendingTuitions: number; approvedTuitions: number; revenue: number;
};

export default function AdminOverview() {
  return (
    <StatsOverview<Stats>
      title="Admin overview"
      subtitle="Platform statistics."
      endpoint="/api/admin/stats"
      actions={[
        { icon: Users, label: "Manage users", href: "/dashboard/admin/users" },
        { icon: ShieldCheck, label: "Review tuitions", href: "/dashboard/admin/tuitions" },
        { icon: CreditCard, label: "View transactions", href: "/dashboard/admin/transactions" },
      ]}
      cards={(statistics) => [
        { icon: Users, label: "Total users", value: statistics.totalUsers, note: "All registered accounts" },
        { icon: GraduationCap, label: "Total tutors", value: statistics.totalTutors, note: "Accounts with tutor role" },
        {
          icon: ShieldCheck,
          label: "Pending / Approved",
          value: `${statistics.pendingTuitions} / ${statistics.approvedTuitions}`,
          note: "Tuition posts",
        },
        { icon: DollarSign, label: "Stripe revenue", value: `$${statistics.revenue.toLocaleString()}`, note: "Subscription payments" },
      ]}
    />
  );
}