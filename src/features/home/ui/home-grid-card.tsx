"use client";

import { useContentParam } from "@/hooks/use-content-param";
import type { Record } from "@/types/allrecords.types";

interface HomeGridCardProps {
  record: Record;
}

function HomeGridCard({ record }: HomeGridCardProps) {
  const { setContent } = useContentParam();

  if (!record.thumbnail) return null;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContent(record.slug);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative flex h-[calc(190/619*100svw)] w-full cursor-pointer items-center justify-center sm:h-[calc(272/1920*100svw)] sm:w-full"
    >
      <div className="relative h-full w-full rounded-lg">
        <img
          src={record.thumbnail}
          alt={record.title}
          className="absolute inset-0 h-full w-full rounded-md object-contain"
        />
        {/* <h2>{record.title}</h2>
        <p>{record.slug}</p> */}
      </div>
    </button>
  );
}

export default HomeGridCard;
