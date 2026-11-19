"use client";

import { useSession } from "@/app/lib/auth-client";
import { normalizeUserRole } from "@/components/type";

export function useRole() {
  const { data: session, isPending } = useSession();
  const role = normalizeUserRole(session?.user?.role);
  return { session, role, isPending };
}