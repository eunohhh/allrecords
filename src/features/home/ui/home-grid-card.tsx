"use client";

import type { Record } from "@/types/allrecords.types";
import Link from "next/link";

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
