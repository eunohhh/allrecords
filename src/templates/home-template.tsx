"use client";

import { HomeFloating, HomeGrid } from "@/features/home";

function HomeTemplate() {
  return (
    <section className="flex h-svh flex-col">
      <div className="flex flex-col gap-4 pb-4">
        <h1 className="font-bold text-[calc(36/640*100svw)] sm:text-4xl">
          allrecords.me
        </h1>
      </div>
      <HomeGrid />
      <HomeFloating />
    </section>
  );
}

export default HomeTemplate;
