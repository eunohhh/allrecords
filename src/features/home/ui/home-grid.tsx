"use client";

import HomeGridCard from "./home-grid-card";

function HomeGrid() {
  return (
    <section className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {Array.from({ length: 80 }).map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
        <HomeGridCard key={index} />
      ))}
    </section>
  );
}

export default HomeGrid;
