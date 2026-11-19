"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "./use-role";


export default function DashboardIndex() {
  const { session, role, isPending } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (isPending) return;
    router.replace(session ? `/dashboard/${role}` : "/sign-in");
  }, [isPending, session, role, router]);

  return <p className="text-slate-500">Loading…</p>;
}