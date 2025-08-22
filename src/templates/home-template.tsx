"use client";

import { HomeFloating, HomeGrid } from "@/features/home";

function HomeTemplate() {
  return (
    <main className="flex h-svh flex-col px-2">
      <div className="flex flex-col gap-4 pb-4">
        <h1 className="font-bold text-4xl">allrecords.me</h1>
      </div>
      <HomeGrid />
      <HomeFloating />
    </main>
  );
}

export default HomeTemplate;
