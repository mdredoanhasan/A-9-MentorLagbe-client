"use client";

import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRole } from "./use-role";

export function DashboardTopbar() {
  const { session, role } = useRole();
  const pathname = usePathname();
  const userName = session?.user?.name ?? "User";
  const initials = userName
    .split(" ")
    .map((namePart) => namePart[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const currentRouteSegment = pathname.split("/").pop() ?? "";
  const title =
    currentRouteSegment === role
      ? "Overview"
      : currentRouteSegment.replace(/-/g, " ");

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-[#e3e5f5] bg-[#faf8f4] px-4">
      <SidebarTrigger className="text-[#1e2a78] hover:bg-[#e6eafc]" />
      <Separator orientation="vertical" className="h-5" />
      <h2 className="text-sm font-medium capitalize text-slate-500">{title}</h2>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden text-sm font-medium text-[#101535] sm:block">{userName}</span>
        <Avatar className="h-9 w-9">
          <AvatarFallback className="bg-[#1e2a78] text-sm font-semibold text-white">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}