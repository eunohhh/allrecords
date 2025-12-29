"use client";

import { useEffect } from "react";
import {
  buildImageUrl,
  PRELOAD_COUNT,
  PRELOAD_TARGET_QUALITY,
  PRELOAD_TARGET_WIDTH,
} from "@/features/home/ui/home-grid";
import { useIsMobile } from "@/hooks/use-mobile";
import { Category } from "@/types/allrecords.types";
import type { RecordImage } from "../model/record.type";
import GnyangImage from "./gnyang-image";

interface GnyangImagesProps {
  recordImages: RecordImage[] | null;
  type: Category;
  isNeedObjectCover: boolean;
  shouldPreload?: boolean;
  loadedImageUrls: Set<string>;
}

function GnyangImages({
  recordImages,
  type,
  isNeedObjectCover,
  shouldPreload = false,
  loadedImageUrls,
}: GnyangImagesProps) {
  const isMobile = useIsMobile();
  useEffect(() => {
    if (!shouldPreload || !recordImages?.length) return;

    recordImages.slice(0, PRELOAD_COUNT).forEach((image) => {
      if (!image?.url) return;
      const preloadUrl = buildImageUrl(
        image.url,
        PRELOAD_TARGET_WIDTH[isMobile ? "mobile" : "desktop"],
        PRELOAD_TARGET_QUALITY[isMobile ? "mobile" : "desktop"]
      );
      if (loadedImageUrls.has(preloadUrl)) return;
      const img = new Image();
      img.src = preloadUrl;
      loadedImageUrls.add(preloadUrl);
    });
  }, [
    recordImages,
    shouldPreload,
    loadedImageUrls.has,
    loadedImageUrls.add,
    isMobile,
  ]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
      {recordImages?.map((image, index) =>
        image && typeof image === "object" ? (
          <div
            className="relative w-full flex-1 items-center justify-center"
            key={(image as RecordImage).id}
          >
            <GnyangImage
              image={image as RecordImage}
              type={type}
              isNeedObjectCover={isNeedObjectCover}
              isPriority={index === 0}
              loadedImageUrls={loadedImageUrls}
            />
          </div>
        ) : null
      )}
    </div>
  );
}

export default GnyangImages;
