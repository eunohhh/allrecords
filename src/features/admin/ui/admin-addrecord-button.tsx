"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAdminStore } from "../model/admin.store";

function AdminAddRecordButton() {
  const { setIsModalOpen } = useAdminStore();

  return (
    <Button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
      <Plus />
      글쓰기
    </Button>
  );
}

export default AdminAddRecordButton;
