"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAdminStore } from "../model/admin.store";

interface AdminAddButtonProps {
  type: "records" | "descs";
}

function AdminAddButton({ type }: AdminAddButtonProps) {
  const { setIsModalOpen } = useAdminStore();

  return (
    <Button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
      <Plus />
      {type === "records" ? "글쓰기" : "설명추가"}
    </Button>
  );
}

export default AdminAddButton;
