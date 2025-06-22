"use client";

import { HomeFloating, HomeGrid } from "@/features/home";

function HomeTemplate() {
  return (
    <main className="flex flex-col h-svh px-2">
      <div className="flex flex-col gap-4 pb-4">
        <h1 className="text-4xl font-bold">allrecords.me</h1>
      </div>
      <HomeGrid />
      <HomeFloating />
    </main>
  );
}

export default HomeTemplate;
