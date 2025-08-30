"use client";

import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import {
  AdminHeader,
  AdminRecordsDatatable,
  AdminRecordsModal,
} from "@/features/admin";
import { useAdminStore } from "@/features/admin/model/admin.store";

function AdminRecordsTemplate() {
  const { selectedItem, isModalOpen, setIsModalOpen } = useAdminStore(
    useShallow((state) => ({
      selectedItem: state.selectedItem,
      isModalOpen: state.isModalOpen,
      setIsModalOpen: state.setIsModalOpen,
    }))
  );

  useEffect(() => {
    if (selectedItem) setIsModalOpen(true);
  }, [selectedItem, setIsModalOpen]);

  return (
    <section className="flex w-full flex-col gap-2 pr-4">
      <AdminHeader title="records" />
      <AdminRecordsDatatable />
      <AdminRecordsModal
        record={selectedItem ?? undefined}
        open={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </section>
  );
}

export default AdminRecordsTemplate;
