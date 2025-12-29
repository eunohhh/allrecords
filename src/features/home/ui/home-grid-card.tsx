"use client";

import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentParam } from "@/hooks/use-content-param";
import { cn } from "@/lib/utils";
import type { Record } from "@/types/allrecords.types";

interface HomeGridCardProps {
  record: Record;
}

function HomeGridCard({ record }: HomeGridCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setContent } = useContentParam();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContent(record.slug);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // 에러 발생 시에도 스켈레톤을 숨김
    setIsLoaded(true);
  };

  if (!record.thumbnail) return null;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="relative flex aspect-square h-auto w-full cursor-pointer items-center justify-center"
    >
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={record.thumbnail}
          alt={record.title}
          className={cn(
            "relative h-full w-full object-contain transition-opacity duration-200",
            isLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading="lazy"
        />
        {!isLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
      </div>
    </button>
  );
}

export default HomeGridCard;
