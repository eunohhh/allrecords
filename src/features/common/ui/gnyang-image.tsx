"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import LoadingStar from "@/features/home/ui/loading-star";
import { cn } from "@/lib/utils";
import { Category } from "@/types/allrecords.types";
import type { RecordImage } from "../model/record.type";

interface GnyangImageProps {
  image: RecordImage;
  type: Category;
  isNeedObjectCover: boolean;
  isPriority?: boolean;
  loadedImageUrls: Set<string>;
}

function GnyangImage({
  image,
  type,
  isNeedObjectCover,
  isPriority = false,
  loadedImageUrls,
}: GnyangImageProps) {
  const [isLoaded, setIsLoaded] = useState(() =>
    loadedImageUrls.has(image.url)
  );
  const [showLoader, setShowLoader] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  // priority 이미지가 이미 캐시되어 있는 경우 처리
  useEffect(() => {
    if (loadedImageUrls.has(image.url)) {
      setIsLoaded(true);
      return;
    }
    if (imgRef.current?.complete) {
      setIsLoaded(true);
      loadedImageUrls.add(image.url);
      return;
    }
    setIsLoaded(false);
  }, [image.url, loadedImageUrls]);

  useEffect(() => {
    if (isLoaded) {
      setShowLoader(false);
      return;
    }
    const timer = setTimeout(() => setShowLoader(true), 100);
    return () => clearTimeout(timer);
  }, [isLoaded]);

  const handleLoad = () => {
    setIsLoaded(true);
    loadedImageUrls.add(image.url);
  };

  const handleError = () => {
    // 에러 발생 시에도 로더를 숨김
    setIsLoaded(true);
    loadedImageUrls.add(image.url);
  };

  return (
    <div
      className={cn(
        "relative flex min-h-[300px] w-full items-center justify-center sm:min-h-[480px]",
        {
          "h-[480px] min-h-[480px] sm:h-[520px] sm:max-h-[520px]":
            type === "grim",
          "h-[300px] min-h-[300px] sm:h-[682px] sm:max-h-[682px] sm:min-h-[400px]":
            type === "ilsang",
          "h-[228px] min-h-[228px] sm:h-[500px] sm:min-h-[300px]":
            isNeedObjectCover,
        }
      )}
    >
      <Image
        ref={imgRef}
        src={image.url}
        alt={image.desc}
        className={cn(
          "h-full w-full object-contain transition-opacity duration-200",
          isLoaded ? "opacity-100" : "opacity-0",
          isNeedObjectCover && "object-cover"
        )}
        onLoad={handleLoad}
        fill
        sizes="(max-width: 768px) 375px, (max-width: 1024px) 375px, 375px"
        priority={isPriority}
        loading={isPriority ? "eager" : "lazy"}
        fetchPriority={isPriority ? "high" : "auto"}
        placeholder="empty"
        quality={50}
        onError={handleError}
      />

      {showLoader && (
        <LoadingStar className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-6 w-6" />
      )}
    </div>
  );
}

export default GnyangImage;
