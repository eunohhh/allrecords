"use client";

import Image from "next/image";
import type { Json } from "@/types/supabase";
import type { RecordImage } from "../model/record.type";

interface RecordImagesProps {
  recordImages: Json[] | null;
}

function RecordImages({ recordImages }: RecordImagesProps) {
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
            />
          </div>
        ) : null
      )}
    </div>
  );
}

export default RecordImages;
