"use client";

import { AdminDatatable, AdminHeader } from "@/features/admin";

function AdminRecordsTemplate() {
  return (
    <section className="w-full flex flex-col gap-2 pr-4">
      <AdminHeader />
      <AdminDatatable />
    </section>
  );
}

export default AdminRecordsTemplate;
