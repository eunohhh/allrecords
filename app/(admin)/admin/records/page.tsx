import AdminRecordsTemplate from "@/templates/admin-records-template";
import { Suspense } from "react";

function AdminRecordsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminRecordsTemplate />
    </Suspense>
  );
}

export default AdminRecordsPage;
