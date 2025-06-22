"use client";

import { Button } from "@/components/ui/button";
import type { RecordImagePost } from "@/types/allrecords.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X } from "lucide-react";

interface AdminSortableImageProps {
  image: RecordImagePost;
  onDelete: (id: number) => void;
}

function AdminSortableImage({ image, onDelete }: AdminSortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(image.id);
  };

  const imageSrc = image.url ? image.url : URL.createObjectURL(image.file!);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex h-20 w-20 items-center justify-center border border-gray-200 p-0 sm:h-30 sm:w-30 md:h-40 md:w-40"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-move"
      />
      <img
        src={imageSrc}
        alt={image.desc}
        className="h-full w-full object-cover rounded-sm"
      />
      <Button
        variant="secondary"
        className="absolute right-0 top-0 h-4 w-4 p-0 cursor-pointer z-10 has-[>svg]:px-2"
        onClick={handleDelete}
      >
        <X />
      </Button>
    </div>
  );
}

export default AdminSortableImage;
