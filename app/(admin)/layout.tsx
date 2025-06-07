import type { PropsWithChildren } from "react";

function AdminLayout({ children }: PropsWithChildren) {
  return <section className="flex h-svh w-full">{children}</section>;
}

export default AdminLayout;
