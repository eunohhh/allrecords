import { Toaster } from "@/components/ui/sonner";
import { getUser } from "@/lib/server-utils";
import AdminLayoutTemplate from "@/templates/admin-layout-template";
import type { PropsWithChildren } from "react";

async function AdminLayout({ children }: PropsWithChildren) {
  const user = await getUser();

  return (
    <>
      <AdminLayoutTemplate user={user}>{children}</AdminLayoutTemplate>
      <Toaster richColors position="top-center" />
    </>
  );
}

export default AdminLayout;
