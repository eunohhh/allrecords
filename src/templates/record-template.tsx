"use client";

import { RecordHeader, RecordImages, useRecordQuery } from "@/features/record";

interface RecordTemplateProps {
  slug: string;
}

function RecordTemplate({ slug }: RecordTemplateProps) {
  const { data: record, isPending, error } = useRecordQuery(slug);

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="flex h-svh flex-col px-2">
      <RecordHeader record={record} />
      <RecordImages recordImages={record.images} />
    </main>
  );
}

export default RecordTemplate;
