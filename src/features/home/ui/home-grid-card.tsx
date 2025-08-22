"use client";

import type { Record } from "@/types/allrecords.types";
import Link from "next/link";

interface HomeGridCardProps {
  record: Record;
}

function HomeGridCard({ record }: HomeGridCardProps) {
  return (
    <Link href={`/${record.slug}`}>
      <div className="rounded-lg bg-green-500 px-2 py-12">
        <h2>{record.title}</h2>
        <p>{record.slug}</p>
      </div>
    </Link>
  );
}

export default HomeGridCard;
