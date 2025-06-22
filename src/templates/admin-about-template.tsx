"use client";

import {
  AdminAboutDatatable,
  AdminDescModal,
  AdminHeader,
} from "@/features/admin";
import { useAdminStore } from "@/features/admin/model/admin.store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

function AdminAboutTemplate() {
  const { selectedDesc, isModalOpen, setIsModalOpen } = useAdminStore(
    useShallow((state) => ({
      selectedDesc: state.selectedDesc,
      isModalOpen: state.isModalOpen,
      setIsModalOpen: state.setIsModalOpen,
    }))
  );

  useEffect(() => {
    if (selectedDesc) setIsModalOpen(true);
  }, [selectedDesc, setIsModalOpen]);

  return (
    <section className="w-full flex flex-col gap-2 pr-4">
      <AdminHeader title="descs" />
      <AdminAboutDatatable />
      <AdminDescModal
        open={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        desc={selectedDesc ?? undefined}
      />
    </section>
  );
}

export default AdminAboutTemplate;
