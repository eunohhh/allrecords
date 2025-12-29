"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { env } from "@/env/t3-env";
import { useContentParam } from "@/hooks/use-content-param";
import useForesight from "@/hooks/use-foresight";
import { cn } from "@/lib/utils";
import type { Record } from "@/types/allrecords.types";

const WIDTHS = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const QUALITY = 75;

// 이미 프리로드된 이미지 URL을 추적
const preloadedUrls = new Set<string>();

interface HomeGridCardProps {
  record: Record;
}

function HomeGridCard({ record }: HomeGridCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setContent } = useContentParam();
  const imgRef = useRef<HTMLImageElement>(null);

  const fetchImage = useCallback(
    async (supabaseStorageUrl: string, width: number) => {
      const url = `${env.NEXT_PUBLIC_URL}/_next/image?url=${encodeURIComponent(supabaseStorageUrl)}&w=${width}&q=${QUALITY}`;
      const response = await fetch(url);
      if (response.ok) {
        return response.url;
      }
      return null;
    },
    []
  );

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
        const supabaseStorageUrl = (image as { url: string }).url;

        for (const width of WIDTHS) {
          const imageUrl = await fetchImage(supabaseStorageUrl, width);
          if (!imageUrl) continue;
          if (preloadedUrls.has(imageUrl)) continue;
          preloadedUrls.add(imageUrl);
        }
      }
    }
  }, [record.images, fetchImage]);

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
      className="relative flex aspect-square h-auto w-full cursor-pointer items-center justify-center"
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
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
        />
        {!isLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
      </div>
    </button>
  );
}

export default HomeGridCard;
