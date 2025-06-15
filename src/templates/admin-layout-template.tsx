"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/features/admin";
import type { User } from "@supabase/supabase-js";
import type { PropsWithChildren } from "react";

function AdminLayoutTemplate({
  children,
  user,
}: PropsWithChildren<{ user: User | null }>) {
  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <main className="flex h-svh w-full">
        <SidebarTrigger className="cursor-pointer" />
        {children}
      </main>
    </SidebarProvider>
  );
}

export default AdminLayoutTemplate;
