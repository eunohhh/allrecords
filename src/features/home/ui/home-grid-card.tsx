"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentParam } from "@/hooks/use-content-param";
import useForesight from "@/hooks/use-foresight";
import { cn } from "@/lib/utils";
import type { Record } from "@/types/allrecords.types";

// 이미 프리로드된 이미지 URL을 추적
const preloadedUrls = new Set<string>();

interface HomeGridCardProps {
  record: Record;
}

function HomeGridCard({ record }: HomeGridCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setContent } = useContentParam();
  const imgRef = useRef<HTMLImageElement>(null);

  // 상세 이미지들을 미리 로드하는 함수
  const preloadImages = useCallback(() => {
    if (!record.images || !Array.isArray(record.images)) return;

    record.images.forEach((image) => {
      if (
        image &&
        typeof image === "object" &&
        "url" in image &&
        typeof (image as { url?: unknown }).url === "string"
      ) {
        const url = (image as { url: string }).url;

        // 이미 프리로드된 URL은 건너뛰기
        if (preloadedUrls.has(url)) return;

        // 프리로드 실행
        const img = new Image();
        img.src = url;
        preloadedUrls.add(url);
      }
    });
  }, [record.images]);

  // ForesightJS로 마우스 움직임 예측하여 미리 이미지 로드
  const { elementRef: buttonRef } = useForesight<HTMLButtonElement>({
    callback: preloadImages,
    hitSlop: { top: 50, right: 50, bottom: 50, left: 50 }, // 요소 주변 50px 범위에서 예측
    name: `card-${record.slug}`,
  });

  useEffect(() => {
    // 이미지가 이미 로드되어 있는지 확인 (캐시된 경우)
    if (imgRef.current?.complete) {
      setIsLoaded(true);
    }
  }, []);

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
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      onFocus={preloadImages}
      className="relative flex h-[calc(190/619*100svw)] w-full cursor-pointer items-center justify-center sm:h-[calc(272/1920*100svw)] sm:w-full"
    >
      <div className="relative h-full w-full overflow-hidden">
        <img
          ref={imgRef}
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
