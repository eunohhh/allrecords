"use client";

import { useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { GnyangHeader, GnyangImages, useRecordQuery } from "@/features/common";
import type { RecordImage } from "@/features/common/model/record.type";
import { Category, Record } from "@/types/allrecords.types";

interface GnyangModalProps {
  slug: string | null;
  isOpen: boolean;
  onClose: () => void;
  initialRecord?: Record;
}

function GnyangModal({
  slug,
  isOpen,
  onClose,
  initialRecord,
}: GnyangModalProps) {
  const {
    data: record,
    isPending,
    error,
  } = useRecordQuery(slug || "", initialRecord);

  const isNeedObjectCover = useMemo(() => {
    // desc 의 "일상-{숫자}" 패턴에서
    // 숫자를 추출하여 27 이상 45 이하인 경우에만 true 를 반환
    const twentysevenTofourtyfive = (record?.images as RecordImage[])?.some(
      (image) => {
        const match = image.desc.match(/^일상-(\d+)/);
        if (!match?.[1]) return false;
        const number = parseInt(match[1], 10);
        return number >= 27 && number <= 45;
      }
    );
    return twentysevenTofourtyfive;
  }, [record?.images]);

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
      <DialogContent
        className="flex max-h-[95svh] min-h-[70svh] max-w-svw flex-col justify-start rounded-none sm:min-w-[40svw] sm:max-w-3xl"
        overlayClassName="bg-black/80"
      >
        <DialogHeader className="hidden">
          <DialogTitle>{record?.title}</DialogTitle>
          <DialogDescription>{record?.title}</DialogDescription>
        </DialogHeader>
        {record && <GnyangHeader record={record} />}
        <ScrollArea className="min-h-0 flex-1 overflow-y-auto">
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
              <GnyangImages
                recordImages={record.images as RecordImage[]}
                type={record.category as Category}
                isNeedObjectCover={isNeedObjectCover}
                shouldPreload={isOpen}
              />
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default GnyangModal;
