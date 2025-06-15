"use client";

import { useShallow } from "zustand/react/shallow";
import { useAdminRecordsDeleteMutation } from "../hooks/admin.queries";
import { useAdminStore } from "../model/admin.store";
import AdminAddRecordButton from "./admin-addrecord-button";
import AdminDeleteButton from "./admin-delete-button";
import AdminModal from "./admin-modal";

function AdminHeader() {
  const { selectedItems, isModalOpen, setIsModalOpen } = useAdminStore(
    useShallow((state) => ({
      selectedItems: state.selectedItems,
      isModalOpen: state.isModalOpen,
      setIsModalOpen: state.setIsModalOpen,
    }))
  );

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
          <AdminAddRecordButton setIsModalOpen={setIsModalOpen} />
          <AdminDeleteButton onClick={handleDeleteRecords} />
        </div>
      </div>
      <AdminModal open={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </>
  );
}

export default AdminHeader;
