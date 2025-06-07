"use client";

import type { Record } from "../model/home.type";
import HomeCheckbox from "./home-checkbox";
import HomeGridCard from "./home-grid-card";

interface HomeGridProps {
  allRecords: Record[];
}

function HomeGrid({ allRecords }: HomeGridProps) {
  return (
    <section className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 justify-end">
        <HomeCheckbox label="daily" id="daily" />
        <HomeCheckbox label="hosoop" id="hosoop" />
        <HomeCheckbox label="work" id="work" />
      </div>
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {allRecords.map((record) => (
          <HomeGridCard key={record.id} record={record} />
        ))}
      </div>
    </section>
  );
}

export default HomeGrid;
