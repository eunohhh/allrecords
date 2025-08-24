"use client";

import Link from "next/link";
import type { Record } from "@/types/allrecords.types";

interface HomeGridCardProps {
  record: Record;
}

function HomeGridCard({ record }: HomeGridCardProps) {
  if (!record.thumbnail) return null;

  return (
    <Link href={`/${record.slug}`}>
      <div className="relative rounded-lg px-2 py-12">
        <img
          src={record.thumbnail}
          alt={record.title}
          className="absolute inset-0 h-full w-full rounded-md object-contain"
        />
        {/* <h2>{record.title}</h2>
        <p>{record.slug}</p> */}
      </div>
    </Link>
  );
}

export default HomeGridCard;
