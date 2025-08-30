"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RecordHeader, RecordImages, useRecordQuery } from "@/features/record";

interface RecordModalProps {
  slug: string | null;
  isOpen: boolean;
  onClose: () => void;
}

function RecordModal({ slug, isOpen, onClose }: RecordModalProps) {
  const { data: record, isPending, error } = useRecordQuery(slug || "");

  if (isPending) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogHeader className="hidden">
          <DialogTitle>Loading...</DialogTitle>
        </DialogHeader>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center p-8">
            <div>Loading...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !record) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogHeader className="hidden">
          <DialogTitle>Error</DialogTitle>
        </DialogHeader>
        <DialogContent className="max-w-4xl">
          <div className="flex items-center justify-center p-8">
            <div>Error: {error?.message || "Record not found"}</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-svw max-h-[90svh] sm:max-w-4xl">
      <div className="h-2" />
        <DialogHeader className="hidden">
          <DialogTitle>{record.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(90svh-120px)]">
          <div className="space-y-4">
            <RecordHeader record={record} />
            <RecordImages recordImages={record.images} />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default RecordModal;
