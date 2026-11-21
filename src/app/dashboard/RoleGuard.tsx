"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import type { UserRole } from "@/components/type";
import { useRole } from "./use-role";

export function RoleGuard({
  allowedRoles,
  children,
}: {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}) {
  const { session, role: currentRole, isPending } = useRole();
  const router = useRouter();
  const pathname = usePathname();
  const redirectStarted = useRef(false);

  useEffect(() => {
    if (isPending || redirectStarted.current) return;

    if (!session) {
      redirectStarted.current = true;
      const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      toast.error("Please sign in to continue.");
      router.replace(
        `/sign-in?callbackUrl=${encodeURIComponent(currentPath)}`,
      );
      return;
    }

    if (allowedRoles && !allowedRoles.includes(currentRole)) {
      redirectStarted.current = true;
      toast.error("You do not have permission to open that page.");
      router.replace("/unauthorized");
    }
  }, [allowedRoles, currentRole, isPending, pathname, router, session]);

  const isAuthorized =
    !isPending &&
    !!session &&
    (!allowedRoles || allowedRoles.includes(currentRole));

  if (!isAuthorized) {
    return (
      <main className="flex min-h-[50vh] items-center justify-center bg-[#faf8f4] px-6">
        <p role="status" className="text-slate-500">
          Checking your account...
        </p>
      </main>
    );
  }

  return children;
}