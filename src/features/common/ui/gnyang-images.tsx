"use client";

import { Category } from "@/types/allrecords.types";
import type { RecordImage } from "../model/record.type";
import GnyangImage from "./gnyang-image";

interface GnyangImagesProps {
  recordImages: RecordImage[] | null;
  type: Category;
  isNeedObjectCover: boolean;
}

function GnyangImages({
  recordImages,
  type,
  isNeedObjectCover,
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
              type={type}
              isNeedObjectCover={isNeedObjectCover}
            />
          </div>
        ) : null
      )}
    </div>
  );
}

export default GnyangImages;
