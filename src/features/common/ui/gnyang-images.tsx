"use client";

import { useEffect } from "react";
import { Category } from "@/types/allrecords.types";
import type { RecordImage } from "../model/record.type";
import GnyangImage from "./gnyang-image";

const PRELOAD_COUNT = 6;
const PRELOAD_WIDTH = 720;
const PRELOAD_QUALITY = 50;

interface GnyangImagesProps {
  recordImages: RecordImage[] | null;
  type: Category;
  isNeedObjectCover: boolean;
  shouldPreload?: boolean;
  loadedImageUrls: Set<string>;
}

function buildImageUrl(src: string, width: number, quality: number) {
  const joiner = src.includes("?") ? "&" : "?";
  return `${src}${joiner}width=${width}&quality=${quality}`;
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

    recordImages.slice(0, PRELOAD_COUNT).forEach((image) => {
      if (!image?.url) return;
      const preloadUrl = buildImageUrl(
        image.url,
        PRELOAD_WIDTH,
        PRELOAD_QUALITY
      );
      if (loadedImageUrls.has(preloadUrl)) return;
      const img = new Image();
      img.src = preloadUrl;
      loadedImageUrls.add(preloadUrl);
    });
  }, [recordImages, shouldPreload, loadedImageUrls.has, loadedImageUrls.add]);

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
