"use client";

import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import {
  useAdminDescsDeleteMutation,
  useAdminRecordsDeleteMutation,
} from "../hooks/admin.queries";
import { useAdminStore } from "../model/admin.store";

interface AdminDeleteButtonProps {
  type: "records" | "descs";
}

function AdminDeleteButton({ type }: AdminDeleteButtonProps) {
  const router = useRouter();
  const { selectedItems, selectedDescs } = useAdminStore(
    useShallow((state) => ({
      selectedItems: state.selectedItems,
      selectedDescs: state.selectedDescs,
    }))
  );

  const {
    mutate: deleteRecords,
    isPending,
    error,
  } = useAdminRecordsDeleteMutation();

  const {
    mutate: deleteDescs,
    isPending: isDeletingDescs,
    error: deletingDescsError,
  } = useAdminDescsDeleteMutation();

  const handleDeleteRecords = () => {
    if (type === "records") {
      deleteRecords(selectedItems.map((item) => item.id));
    } else {
      deleteDescs(selectedDescs.map((item) => item.id));
    }
  };

  useEffect(() => {
    if (error || deletingDescsError) {
      toast.error("삭제 실패");
      router.refresh();
    }
  }, [error, deletingDescsError, router]);

  if (isPending || isDeletingDescs)
    return (
      <Button disabled>
        <Loader2 className="animate-spin" />
        삭제중...
      </Button>
    );

  return (
    <Button className="cursor-pointer" onClick={handleDeleteRecords}>
      <Trash />
      선택 삭제
    </Button>
  );
}

export default AdminDeleteButton;
