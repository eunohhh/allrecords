"use client";

import { AdminDatatable, AdminHeader, AdminModal } from "@/features/admin";
import { useAdminStore } from "@/features/admin/model/admin.store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

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
    <section className="w-full flex flex-col gap-2 pr-4">
      <AdminHeader />
      <AdminDatatable />
      <AdminModal
        record={selectedItem ?? undefined}
        open={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </section>
  );
}

export default AdminRecordsTemplate;
