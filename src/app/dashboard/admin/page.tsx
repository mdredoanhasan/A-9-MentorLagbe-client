"use client";

import { Users, GraduationCap, ShieldCheck, DollarSign } from "lucide-react";
import { StatsOverview } from "../ui";


type Stats = {
  totalUsers: number; totalMentors: number;
  pendingTuitions: number; approvedTuitions: number; revenue: number;
};

export default function AdminOverview() {
  return (
    <StatsOverview<Stats>
      title="Admin overview"
      subtitle="Platform statistics."
      endpoint="/api/admin/stats"
      cards={(statistics) => [
        { icon: Users, label: "Total users", value: statistics.totalUsers, note: "All registered accounts" },
        { icon: GraduationCap, label: "Total mentors", value: statistics.totalMentors, note: "Accounts with mentor role" },
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