"use client";

import { useEffect } from "react";
import { PRELOAD_COUNT } from "@/constants/allrecords.consts";
import { preloadImages } from "@/lib/preload-image";
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

    // 프리로드할 URL 추출 (이미 로드된 것은 제외)
    const srcs = recordImages
      .slice(0, PRELOAD_COUNT)
      .filter((image) => image?.url && !loadedImageUrls.has(image.url))
      .map((image) => image.url);

    if (srcs.length === 0) return;

    // 프리로드 전에 URL 등록 (중복 호출 방지)
    for (const src of srcs) {
      loadedImageUrls.add(src);
    }

    preloadImages(srcs, { scale: 1 });
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
