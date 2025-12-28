"use client";

import type { Record } from "@/types/allrecords.types";

interface GnyangHeaderProps {
  record: Record;
}

function GnyangHeader({ record }: GnyangHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      {record.title.length > 0 && record.category !== "poolsoop" && (
        <h1 className="font-bold text-2xl">{record.title}</h1>
      )}
      {record.description.length > 0 && (
        <p className="text-gray-500 text-sm">{record.description}</p>
      )}
    </div>
  );
}

export default GnyangHeader;
