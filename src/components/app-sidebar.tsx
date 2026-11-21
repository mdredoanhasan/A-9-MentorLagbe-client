"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, FileText, PlusCircle, BookOpen, Users, ShieldCheck, CreditCard, LogOut,
} from "lucide-react";
import { signOut } from "@/app/lib/auth-client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { SidebarNavItem, UserRole } from "./type";
import { useRole } from "@/app/dashboard/use-role";

const menuItemsByRole: Record<UserRole, SidebarNavItem[]> = {
  student: [
    { _id: "s1", name: "Overview", url: "/dashboard/student", icon: LayoutDashboard },
    { _id: "s2", name: "My Applications", url: "/dashboard/student/my-applications", icon: FileText },
  ],
  tutor: [
    { _id: "t1", name: "Overview", url: "/dashboard/tutor", icon: LayoutDashboard },
    { _id: "t2", name: "Post Tuition", url: "/dashboard/tutor/post-tuition", icon: PlusCircle },
    { _id: "t3", name: "My Tuitions", url: "/dashboard/tutor/my-tuitions", icon: BookOpen },
    { _id: "t4", name: "Applicants", url: "/dashboard/tutor/applicants", icon: Users },
  ],
  admin: [
    { _id: "a1", name: "Overview", url: "/dashboard/admin", icon: LayoutDashboard },
    { _id: "a2", name: "Users", url: "/dashboard/admin/users", icon: Users },
    { _id: "a3", name: "Tuition Approval", url: "/dashboard/admin/tuitions", icon: ShieldCheck },
    { _id: "a4", name: "Transactions", url: "/dashboard/admin/transactions", icon: CreditCard },
  ],
};

export function AppSidebar() {
  const { session, role } = useRole();
  const pathname = usePathname();
  const router = useRouter();
  const userName = session?.user?.name ?? "User";
  const initials = userName
    .split(" ")
    .map((namePart) => namePart[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/"
          className="px-2 pt-1 font-(family-name:--font-fraunces) text-xl font-bold text-white group-data-[collapsible=icon]:hidden"
        >
          Mentor<span className="text-amber-400">Lagbe</span>
        </Link>

        {/* Profile summary */}
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent p-2">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-amber-400 font-semibold text-[#101535]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-white">{userName}</p>
            <p className="text-xs capitalize text-white/60">{role}</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItemsByRole[role as keyof typeof menuItemsByRole].map((item) => (
              <SidebarMenuItem key={item._id}>
                <SidebarMenuButton
                  isActive={pathname === item.url}
                  tooltip={item.name}
                  render={<Link href={item.url} />}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Sign out"
              onClick={async () => {
                await signOut();
                router.push("/sign-in");
              }}
            >
              <LogOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}