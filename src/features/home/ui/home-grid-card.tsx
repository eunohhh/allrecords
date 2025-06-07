"use client";

import Link from "next/link";
import type { Record } from "../model/home.type";

interface HomeGridCardProps {
  record: Record;
}

function HomeGridCard({ record }: HomeGridCardProps) {
  return (
    <Link href={`/${record.slug}`}>
      <div className="bg-green-500 rounded-lg py-12 px-2">
        <h2>{record.title}</h2>
        <p>{record.slug}</p>
      </div>
    </Link>
  );
}

export default HomeGridCard;
