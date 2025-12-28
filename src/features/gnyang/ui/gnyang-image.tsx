"use client";

import { useEffect, useRef, useState } from "react";
import LoadingStar from "@/features/home/ui/loading-star";
import { cn } from "@/lib/utils";
import { Category } from "@/types/allrecords.types";
import type { RecordImage } from "../model/record.type";

interface GnyangImageProps {
  image: RecordImage;
  priority?: boolean; // 우선 로딩 여부 (처음 몇 개 이미지)
  type: Category;
}

function GnyangImage({ image, priority = false, type }: GnyangImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // priority 이미지가 이미 캐시되어 있는 경우 처리
  useEffect(() => {
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    // 에러 발생 시에도 로더를 숨김
    setIsLoaded(true);
  };

  return (
    <div
      className={cn(
        "relative flex h-96 w-full items-center justify-center sm:h-[440px]",
        {
          "sm:h-[520px]": type === "grim",
        }
      )}
    >
      <img
        ref={imgRef}
        src={image.url}
        alt={image.desc}
        className={cn(
          "h-full w-full object-contain transition-opacity duration-200",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
      />
      {!isLoaded && (
        <LoadingStar className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-6 w-6" />
      )}
    </div>
  );
}

export default GnyangImage;
