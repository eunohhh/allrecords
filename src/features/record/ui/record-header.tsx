"use client";

import type { Record } from "@/types/allrecords.types";

interface RecordHeaderProps {
  record: Record;
}

function RecordHeader({ record }: RecordHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold text-2xl">{record.title}</h1>
      <p className="text-gray-500 text-sm">{record.description}</p>
    </div>
  );
}

export default RecordHeader;
