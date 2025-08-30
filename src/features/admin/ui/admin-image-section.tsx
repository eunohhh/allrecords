"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RecordImagePost } from "@/types/allrecords.types";
import AdminSortableImage from "./admin-sortable-image";

interface AdminImageSectionProps {
  fields: (RecordImagePost & { id: string })[];
  onImageModalOpen: () => void;
  onImageDelete: (id: number) => void;
  onDragEnd: (event: DragEndEvent) => void;
}

function AdminImageSection({
  fields,
  onImageModalOpen,
  onImageDelete,
  onDragEnd,
}: AdminImageSectionProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 드래그해야 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <>
      {fields.length > 0 && (
        <div className="grid grid-cols-4 place-items-center gap-2 rounded-md border border-gray-300 px-1 py-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={fields.map((field) => field.id)}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field) => (
                <AdminSortableImage
                  key={field.id}
                  image={field}
                  onDelete={onImageDelete}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
      <div className="grid gap-3">
        <Button
          type="button"
          className="cursor-pointer"
          onClick={onImageModalOpen}
        >
          <Plus /> 이미지 추가
        </Button>
      </div>
    </>
  );
}

export default AdminImageSection;
