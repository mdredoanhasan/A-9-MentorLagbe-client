
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { DashboardTopbar } from "./DashboardTopbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-[#faf8f4]">
        <DashboardTopbar />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}