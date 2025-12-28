"use client";

import Image from "next/image";
import type { Json } from "@/types/supabase";
import type { RecordImage } from "../model/record.type";

interface GnyangImagesProps {
  recordImages: Json[] | null;
}

function GnyangImages({ recordImages }: GnyangImagesProps) {
  return (
    <div className="flex flex-col gap-4">
      {recordImages?.map((image) =>
        image && typeof image === "object" ? (
          <div
            className="relative h-56 w-full sm:h-96"
            key={(image as RecordImage).id}
          >
            <Image
              src={(image as RecordImage).url}
              alt={(image as RecordImage).desc}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
            />
          </div>
        ) : null
      )}
    </div>
  );
}

export default GnyangImages;
