"use client";

import type { Record } from "@/types/allrecords.types";

interface GnyangHeaderProps {
  record: Record;
}

function GnyangHeader({ record }: GnyangHeaderProps) {
  return (
    <div className="flex h-full flex-col gap-4">
      {record.title.length > 0 && (
        <h1 className="font-bold text-md sm:text-2xl">{record.title}</h1>
      )}
      {record.description.length > 0 && (
        <p className="hidden text-gray-500 text-xs sm:text-sm">
          {record.description}
        </p>
      )}
    </div>
  );
}

export default GnyangHeader;
