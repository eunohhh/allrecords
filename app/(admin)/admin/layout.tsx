import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin";
import type { PropsWithChildren } from "react";

function AdminLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex h-svh w-full">
        <SidebarTrigger className="cursor-pointer" />
        {children}
      </main>
    </SidebarProvider>
  );
}

export default AdminLayout;
