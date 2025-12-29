"use client";

import NextImage from "next/image";
import { useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentParam } from "@/hooks/use-content-param";
import useForesight from "@/hooks/use-foresight";
import { cn } from "@/lib/utils";
import type { Record } from "@/types/allrecords.types";
import { buildImageUrl, PRELOAD_QUALITY, PRELOAD_WIDTH } from "./home-grid";

interface HomeGridCardProps {
  record: Record;
  loadedImageUrls: Set<string>;
}

function HomeGridCard({ record, loadedImageUrls }: HomeGridCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setContent } = useContentParam();

  // 상세 이미지들을 미리 로드하는 함수
  const preloadImages = useCallback(async () => {
    if (!record.images || !Array.isArray(record.images)) return;

    for (const image of record.images) {
      if (
        image &&
        typeof image === "object" &&
        "url" in image &&
        typeof (image as { url?: unknown }).url === "string"
      ) {
        const url = (image as { url: string }).url;
        const preloadUrl = buildImageUrl(url, PRELOAD_WIDTH, PRELOAD_QUALITY);

        // 이미 프리로드된 URL은 건너뛰기
        if (loadedImageUrls.has(preloadUrl)) return;

        // 프리로드 실행
        const img = new Image();
        img.src = preloadUrl;
        loadedImageUrls.add(preloadUrl);
      }
    }
  }, [record.images, loadedImageUrls]);

  // ForesightJS로 마우스 움직임 예측하여 미리 이미지 로드
  const { elementRef: buttonRef } = useForesight<HTMLButtonElement>({
    callback: preloadImages,
    hitSlop: { top: 50, right: 50, bottom: 50, left: 50 }, // 요소 주변 50px 범위에서 예측
    name: `card-${record.slug}`,
  });

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContent(record.slug);
  };

  if (!record.thumbnail) return null;

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      onFocus={preloadImages}
      className="relative flex aspect-square h-auto w-full cursor-pointer items-center justify-center"
    >
      <div className="relative h-full w-full overflow-hidden">
        {!isLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
        <NextImage
          src={record.thumbnail}
          alt={record.title}
          className={cn(
            "relative h-full w-full object-contain transition-opacity duration-200"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          fill
          priority
          quality={40}
          onLoad={() => {
            setIsLoaded(true);
          }}
        />
      </div>
    </button>
  );
}

export default HomeGridCard;
