import type { PropsWithChildren } from "react";
import { getUser } from "@/lib/server-utils";
import AdminLayoutTemplate from "@/templates/admin-layout-template";

async function AdminLayout({ children }: PropsWithChildren) {
  const user = await getUser();

  return <AdminLayoutTemplate user={user}>{children}</AdminLayoutTemplate>;
}

export default AdminLayout;
