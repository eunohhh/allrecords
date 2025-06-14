"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface AdminDeleteButtonProps {
  onClick: () => void;
}

function AdminDeleteButton({ onClick }: AdminDeleteButtonProps) {
  return (
    <Button className="cursor-pointer" onClick={onClick}>
      <Trash />
      선택 삭제
    </Button>
  );
}

export default AdminDeleteButton;
