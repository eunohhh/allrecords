"use client";

import { Category } from "@/types/allrecords.types";
import type { RecordImage } from "../model/record.type";
import GnyangImage from "./gnyang-image";

interface GnyangImagesProps {
  recordImages: RecordImage[] | null;
  priorityCount?: number; // 우선 로딩할 이미지 개수 (기본값: 3)
  type: Category;
}

function GnyangImages({
  recordImages,
  priorityCount = 3,
  type,
}: GnyangImagesProps) {
  return (
    <div className="relative flex h-full flex-1 flex-col items-center justify-center gap-4">
      {recordImages?.map((image, index) =>
        image && typeof image === "object" ? (
          <div
            className="relative h-full w-full"
            key={(image as RecordImage).id}
          >
            <GnyangImage
              image={image as RecordImage}
              priority={index < priorityCount}
              type={type}
            />
          </div>
        ) : null
      )}
    </div>
  );
}

export default GnyangImages;
