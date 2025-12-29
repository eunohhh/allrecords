"use client";

import NextImage from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { useContentParam } from "@/hooks/use-content-param";
import useForesight from "@/hooks/use-foresight";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import type { Record } from "@/types/allrecords.types";
import { buildImageUrl, PRELOAD_QUALITY, PRELOAD_WIDTH } from "./home-grid";

interface HomeGridCardProps {
  record: Record;
  loadedImageUrls: Set<string>;
}

const MOBILE_PRELOAD_CONCURRENCY = 2;
let mobilePreloadRunning = 0;
const mobilePreloadQueue: Array<() => void> = [];

function runMobilePreloadQueue() {
  while (
    mobilePreloadRunning < MOBILE_PRELOAD_CONCURRENCY &&
    mobilePreloadQueue.length > 0
  ) {
    const task = mobilePreloadQueue.shift();
    if (!task) return;
    mobilePreloadRunning += 1;
    task();
  }
}

function enqueueMobilePreload(task: () => void) {
  mobilePreloadQueue.push(task);
  runMobilePreloadQueue();
  return true;
}

function HomeGridCard({ record, loadedImageUrls }: HomeGridCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setContent } = useContentParam();
  const isMobile = useIsMobile();
  const hasPreloadedRef = useRef(false);

  // 상세 이미지들을 미리 로드하는 함수
  const preloadImages = useCallback(() => {
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
        if (loadedImageUrls.has(preloadUrl)) {
          continue;
        }

        const doPreload = () => {
          const img = new Image();
          let settled = false;
          const finalize = () => {
            if (settled) return;
            settled = true;
            mobilePreloadRunning = Math.max(0, mobilePreloadRunning - 1);
            runMobilePreloadQueue();
          };
          img.onload = finalize;
          img.onerror = finalize;
          img.src = preloadUrl;
          loadedImageUrls.add(preloadUrl);
          if (img.complete) {
            queueMicrotask(finalize);
          }
          if (img.decode) {
            img.decode().then(finalize).catch(finalize);
          }
          setTimeout(finalize, 5000);
        };

        if (isMobile) {
          const queued = enqueueMobilePreload(doPreload);
          if (!queued) return;
        } else {
          doPreload();
        }
      }
    }
  }, [record.images, loadedImageUrls, isMobile]);

  // ForesightJS로 마우스 움직임 예측하여 미리 이미지 로드
  const { elementRef: buttonRef } = useForesight<HTMLButtonElement>({
    callback: preloadImages,
    hitSlop: { top: 80, right: 80, bottom: 80, left: 80 }, // 요소 주변 80px 범위에서 예측
    name: `card-${record.slug}`,
  });

  const { ref: inViewRef, inView } = useInView({
    rootMargin: "200px",
    triggerOnce: true,
  });

  const setRefs = useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      inViewRef(node);
    },
    [buttonRef, inViewRef]
  );

  useEffect(() => {
    if (!isMobile) return;
    if (!inView) return;
    preloadImages();
  }, [inView, isMobile, preloadImages]);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setContent(record.slug);
  };

  if (!record.thumbnail) return null;

  return (
    <button
      ref={setRefs}
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
