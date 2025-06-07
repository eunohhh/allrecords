"use client";

import { HomeFloating, HomeGrid, useRecordsQuery } from "@/features/home";
import { useEffect } from "react";

function HomeTemplate() {
  const {
    data: allRecords,
    isPending,
    error,
  } = useRecordsQuery({
    page: 1,
    limit: 40,
    search: "",
    sort: "",
    order: "",
  });

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  if (isPending || !allRecords) {
    return <div>Loading...</div>;
  }

  return (
    <main className="flex flex-col h-svh px-2">
      <div className="flex flex-col gap-4 pb-4">
        <h1 className="text-4xl font-bold">allrecords.me</h1>
        <p className="text-sm text-gray-500">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </p>
      </div>
      <HomeGrid allRecords={allRecords} />
      <HomeFloating />
    </main>
  );
}

export default HomeTemplate;
