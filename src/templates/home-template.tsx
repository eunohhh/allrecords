"use client";

import { HomeGrid } from "@/features/home";

function HomeTemplate() {
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
      <HomeGrid />
    </main>
  );
}

export default HomeTemplate;
