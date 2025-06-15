import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { AdminSidebar } from "@/features/admin";
import { getUser } from "@/lib/server-utils";
import type { PropsWithChildren } from "react";

async function AdminLayout({ children }: PropsWithChildren) {
  const user = await getUser();

  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <main className="flex h-svh w-full">
        <SidebarTrigger className="cursor-pointer" />
        {children}
      </main>
      <Toaster richColors position="top-center" />
    </SidebarProvider>
  );
}

export default AdminLayout;
