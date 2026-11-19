"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "./use-role";
import { UserRole } from "@/components/type";


export function RoleGuard({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { session, role: currentRole, isPending } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    if (!session) router.replace("/sign-in");
    else if (currentRole !== role) router.replace(`/dashboard/${currentRole}`);
  }, [isPending, session, currentRole, role, router]);

  if (isPending || !session || currentRole !== role) {
    return <p className="text-slate-500">Loading…</p>;
  }
  return <>{children}</>;
}