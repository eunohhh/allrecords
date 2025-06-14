import { AdminDatatable } from "@/features/admin";

function AdminRecordsTemplate() {
  return (
    <section className="w-full flex flex-col gap-2 pr-4">
      <h1 className="flex h-7 items-center justify-start pl-2">Records</h1>
      <AdminDatatable />
    </section>
  );
}

export default AdminRecordsTemplate;
