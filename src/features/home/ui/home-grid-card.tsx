"use client";

import type { Record } from "../model/home.type";

interface HomeGridCardProps {
  record: Record;
}

function HomeGridCard({ record }: HomeGridCardProps) {
  return (
    <div className="bg-green-500 rounded-lg py-12 px-2">
      <h2>{record.title}</h2>
    </div>
  );
}

export default HomeGridCard;
