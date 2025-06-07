"use client";

import type { Record } from "@/features/home";

interface RecordHeaderProps {
  record: Record;
}

function RecordHeader({ record }: RecordHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{record.title}</h1>
      <p className="text-sm text-gray-500">{record.description}</p>
    </div>
  );
}

export default RecordHeader;
