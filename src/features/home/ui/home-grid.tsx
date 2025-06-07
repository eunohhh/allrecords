"use client";

import HomeCheckbox from "./home-checkbox";
import HomeGridCard from "./home-grid-card";

function HomeGrid() {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 justify-end">
        <HomeCheckbox label="daily" id="daily" />
        <HomeCheckbox label="hosoop" id="hosoop" />
        <HomeCheckbox label="work" id="work" />
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {Array.from({ length: 80 }).map((_, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <HomeGridCard key={index} />
        ))}
      </div>
    </section>
  );
}

export default HomeGrid;
