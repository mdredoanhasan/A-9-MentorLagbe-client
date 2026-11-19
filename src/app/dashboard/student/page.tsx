"use client";

import { FileText, CircleCheck, Clock, Crown } from "lucide-react";
import { StatsOverview } from "../ui";


type Stats = { total: number; accepted: number; pending: number; plan: "free" | "pro" };

export default function StudentOverview() {
  return (
    <StatsOverview<Stats>
      title="Student overview"
      subtitle="Track your applications and learning journey."
      endpoint="/api/student/stats"
      cards={(statistics) => [
        { icon: FileText, label: "Total applied", value: statistics.total, note: "Tuitions you applied for" },
        { icon: CircleCheck, label: "Accepted", value: statistics.accepted, note: "Approved by mentors" },
        { icon: Clock, label: "Pending", value: statistics.pending, note: "Awaiting mentor review" },
        { icon: Crown, label: "Current plan", value: statistics.plan === "pro" ? "Pro" : "Free", note: "Your subscription" },
      ]}
    />
  );
}