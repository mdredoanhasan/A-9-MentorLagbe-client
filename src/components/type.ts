import type { LucideIcon } from "lucide-react";

export type UserRole = "student" | "tutor" | "admin";

export function normalizeUserRole(role: string | undefined): UserRole {
  if (role === "mentor" || role === "tutor") return "tutor";
  if (role === "admin") return "admin";
  return "student";
}

export type SidebarNavItem = { _id: string; name: string; url: string; icon: LucideIcon };

export type Tuition = {
  _id: string;
  title: string;
  subject: string;
  classLevel: string;
  mode: string;
  location: string;
  monthlyFee: number;
  daysPerWeek: number;
  description: string;
  bannerUrl: string;
  approvalStatus: "pending" | "approved" | "rejected";
  status: "active" | "closed";
  tutorName?: string;
  tutorEmail?: string;
};

export type Application = {
  _id: string;
  tuitionTitle: string;
  tutorName: string;
  tutorEmail: string;
  monthlyFee: number;
  createdAt: string;
  status: "pending" | "accepted" | "rejected";
  studentName: string;
  studentEmail: string;
  phone: string;
  schedule: string;
  note: string;
};

export type AppUser = { _id: string; name: string; email: string; role: UserRole };

export type Payment = {
  _id: string;
  userName: string;
  email: string;
  role: UserRole;
  plan: string;
  amount: number;
  transactionId: string;
  paidAt: string;
};