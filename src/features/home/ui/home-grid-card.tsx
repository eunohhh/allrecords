"use client";

import NextImage from "next/image";
import { useCallback, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { IMAGE_SIZES } from "@/constants/allrecords.consts";
import { useContentParam } from "@/hooks/use-content-param";
import useForesight from "@/hooks/use-foresight";
import { preloadImages } from "@/lib/preload-image";
import { cn } from "@/lib/utils";
import type { Record } from "@/types/allrecords.types";

interface HomeGridCardProps {
  record: Record;
  loadedImageUrls: Set<string>;
}

function HomeGridCard({ record, loadedImageUrls }: HomeGridCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setContent } = useContentParam();
  // 상세 이미지들을 미리 로드하는 함수
  const handlePreloadImages = useCallback(() => {
    if (!record.images || !Array.isArray(record.images)) return;

    // 프리로드할 URL 추출 (이미 로드된 것은 제외)
    const srcs: string[] = [];
    for (const image of record.images) {
      if (
        image &&
        typeof image === "object" &&
        "url" in image &&
        typeof (image as { url?: unknown }).url === "string"
      ) {
        const url = (image as { url: string }).url;
        if (!loadedImageUrls.has(url)) {
          srcs.push(url);
        }
      }
    }

    if (srcs.length === 0) return;

    // 프리로드 전에 URL 등록 (중복 호출 방지)
    for (const src of srcs) {
      loadedImageUrls.add(src);
    }

    // 모달/상세는 거의 풀폭에 가깝게 쓰이므로 scale: 1
    preloadImages(srcs, { scale: 1 });
  }, [record.images, loadedImageUrls]);

  // ForesightJS로 마우스 움직임 예측하여 미리 이미지 로드
  const { elementRef: buttonRef } = useForesight<HTMLButtonElement>({
    callback: handlePreloadImages,
    hitSlop: { top: 80, right: 80, bottom: 80, left: 80 }, // 요소 주변 80px 범위에서 예측
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
      onFocus={handlePreloadImages}
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
          sizes={IMAGE_SIZES}
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
