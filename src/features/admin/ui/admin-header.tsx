"use client";

import { useAdminRecordsDeleteMutation } from "../hooks/admin.queries";
import { useAdminStore } from "../model/admin.store";
import AdminAddRecordButton from "./admin-addrecord-button";
import AdminDeleteButton from "./admin-delete-button";

function AdminHeader() {
  const { selectedItems } = useAdminStore();

  const {
    mutate: deleteRecords,
    isPending,
    error,
  } = useAdminRecordsDeleteMutation();

  const handleDeleteRecords = () => {
    deleteRecords(selectedItems.map((item) => item.id));
  };

  return (
    <>
      <div className="flex items-center justify-between pt-2">
        <h1 className="flex items-center justify-start pl-2 text-lg font-bold">
          Records
        </h1>
        <div className="flex items-center justify-end gap-2">
          <AdminAddRecordButton />
          <AdminDeleteButton onClick={handleDeleteRecords} />
        </div>
      </div>
    </>
  );
}

export default AdminHeader;
