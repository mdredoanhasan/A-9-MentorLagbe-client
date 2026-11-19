"use client";

import { BookOpen, ShieldCheck, Users, Crown } from "lucide-react";
import { StatsOverview } from "../ui";


type Stats = { totalTuitions: number; approved: number; applicants: number; plan: "free" | "pro" };

export default function MentorOverview() {
  return (
    <StatsOverview<Stats>
      title="Mentor overview"
      subtitle="Your tuitions and applicants at a glance."
      endpoint="/api/mentor/stats"
      cards={(statistics) => [
        { icon: BookOpen, label: "Tuitions posted", value: statistics.totalTuitions, note: "All your posts" },
        { icon: ShieldCheck, label: "Approved", value: statistics.approved, note: "Live and approved" },
        { icon: Users, label: "Applicants", value: statistics.applicants, note: "Students who applied" },
        {
          icon: Crown,
          label: "Current plan",
          value: statistics.plan === "pro" ? "Pro" : "Free",
          note: statistics.plan === "pro" ? "Unlimited posts" : "Up to 2 posts",
        },
      ]}
    />
  );
}