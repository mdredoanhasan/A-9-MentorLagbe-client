"use client";

import { FileText, CircleCheck, Clock, Crown, Search, Bookmark } from "lucide-react";
import { StatsOverview } from "../ui";


type Stats = { total: number; accepted: number; pending: number; plan: "free" | "pro" };

export default function StudentOverview() {
  return (
    <StatsOverview<Stats>
      title="Student overview"
      subtitle="Track your applications and learning journey."
      endpoint="/api/student/stats"
      actions={[
        { icon: Search, label: "Browse tuitions", href: "/tuitions" },
        { icon: FileText, label: "My applications", href: "/dashboard/student/my-applications" },
        { icon: Bookmark, label: "Saved tuitions", href: "/dashboard/student/bookmarks" },
      ]}
      cards={(statistics) => [
        { icon: FileText, label: "Total applied", value: statistics.total, note: "Tuitions you applied for" },
        { icon: CircleCheck, label: "Accepted", value: statistics.accepted, note: "Approved by tutors" },
        { icon: Clock, label: "Pending", value: statistics.pending, note: "Awaiting tutor review" },
        {
          icon: Crown,
          label: "Current plan",
          value: statistics.plan === "pro" ? "Pro" : "Free",
          note: statistics.plan === "pro" ? "Unlimited bookmarks" : "Up to 5 bookmarks",
        },
      ]}
    />
  );
}