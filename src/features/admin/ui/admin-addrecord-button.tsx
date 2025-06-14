"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface AdminAddRecordButtonProps {
  setIsModalOpen: (isModalOpen: boolean) => void;
}

function AdminAddRecordButton({ setIsModalOpen }: AdminAddRecordButtonProps) {
  return (
    <Button className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
      <Plus />
      글쓰기
    </Button>
  );
}

export default AdminAddRecordButton;
