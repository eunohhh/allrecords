"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GnyangHeader, GnyangImages, useRecordQuery } from "@/features/gnyang";
import LoadingStar from "@/features/home/ui/loading-star";

interface GnyangModalProps {
  slug: string | null;
  isOpen: boolean;
  onClose: () => void;
}

function GnyangModal({ slug, isOpen, onClose }: GnyangModalProps) {
  const { data: record, isPending, error } = useRecordQuery(slug || "");

  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogHeader className="hidden">
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>Error</DialogDescription>
        </DialogHeader>
        <DialogContent className="min-h-3xl min-w-3xl max-w-4xl rounded-none">
          <div className="flex items-center justify-center p-8">
            <div>Error: {error?.message || "Record not found"}</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90svh] max-w-svw rounded-none sm:min-h-3xl sm:min-w-3xl sm:max-w-4xl">
        <div className="h-2" />
        <DialogHeader className="hidden">
          <DialogTitle>{record?.title}</DialogTitle>
          <DialogDescription>{record?.title}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex max-h-[calc(90svh-120px)] items-center justify-center">
          {isPending ? (
            <div className="flex items-center justify-center p-8">
              <LoadingStar />
            </div>
          ) : (
            <div className="space-y-4">
              <GnyangHeader record={record} />
              <GnyangImages recordImages={record.images} />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default GnyangModal;
