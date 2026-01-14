"use client";

import { useEffect } from "react";
import { PRELOAD_COUNT } from "@/constants/allrecords.consts";
import { buildImageUrl } from "@/lib/build-image-url";
import { getPreloadImageParams } from "@/lib/preload-image";
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
  useEffect(() => {
    if (!shouldPreload || !recordImages?.length) return;

    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : 1200;
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;
    const { width, quality } = getPreloadImageParams({
      viewportWidth,
      dpr,
      scale: 1,
    });

    recordImages.slice(0, PRELOAD_COUNT).forEach((image) => {
      if (!image?.url) return;
      const preloadUrl = buildImageUrl(image.url, width, quality);
      if (loadedImageUrls.has(preloadUrl)) return;
      const img = new Image();
      img.src = preloadUrl;
      loadedImageUrls.add(preloadUrl);
    });
  }, [recordImages, shouldPreload, loadedImageUrls]);

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
