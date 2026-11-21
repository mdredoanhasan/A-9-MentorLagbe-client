"use client";

import { BookOpen, ShieldCheck, Users, Crown, PlusCircle } from "lucide-react";
import { StatsOverview } from "../ui";


type Stats = { totalTuitions: number; approved: number; applicants: number; plan: "free" | "pro" };

export default function TutorOverview() {
  return (
    <StatsOverview<Stats>
      title="Tutor overview"
      subtitle="Your tuitions and applicants at a glance."
      endpoint="/api/tutor/stats"
      actions={[
        { icon: PlusCircle, label: "Post a tuition", href: "/dashboard/tutor/post-tuition" },
        { icon: BookOpen, label: "My tuitions", href: "/dashboard/tutor/my-tuitions" },
        { icon: Users, label: "View applicants", href: "/dashboard/tutor/applicants" },
      ]}
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