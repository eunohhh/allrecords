"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { GnyangHeader, GnyangImages, useRecordQuery } from "@/features/gnyang";
import type { RecordImage } from "@/features/gnyang/model/record.type";
import { Category } from "@/types/allrecords.types";

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
      <DialogContent className="flex max-h-[90svh] min-h-[70svh] max-w-svw flex-col justify-start rounded-none sm:min-w-3xl sm:max-w-4xl">
        <DialogHeader className="hidden">
          <DialogTitle>{record?.title}</DialogTitle>
          <DialogDescription>{record?.title}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex h-full items-start justify-center overflow-y-auto">
          {isPending && !record && !error && isOpen && (
            <div className="flex items-center justify-center p-8">
              <Skeleton className="h-56 w-full sm:h-96" />
            </div>
          )}
          {!isOpen && (
            <div className="flex items-center justify-center p-8">
              <Skeleton className="h-56 w-full sm:h-96" />
            </div>
          )}
          {!isPending && record && isOpen && (
            <div className="relative flex h-full min-h-[70svh] flex-1 flex-col space-y-4">
              <GnyangHeader record={record} />
              <GnyangImages
                recordImages={record.images as RecordImage[]}
                type={record.category as Category}
              />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default GnyangModal;
