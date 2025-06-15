"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RecordImagePost } from "@/types/allrecords.types";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAdminStore } from "../model/admin.store";
import AdminImageModal from "./admin-image-modal";

interface AdminModalProps {
  open: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

interface SortableImageProps {
  image: RecordImagePost;
  onDelete: (id: number) => void;
}

function SortableImage({ image, onDelete }: SortableImageProps) {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative flex h-20 w-20 items-center justify-center rounded-md border border-gray-200 p-0 sm:h-30 sm:w-30 md:h-40 md:w-40"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute inset-0 cursor-move"
      />
      <img
        src={URL.createObjectURL(image.file)}
        alt={image.description}
        className="h-full w-full object-cover"
      />
      <Button
        variant="secondary"
        className="absolute right-0 top-0 h-4 w-4 p-0 cursor-pointer z-10"
        onClick={handleDelete}
      >
        <X />
      </Button>
    </div>
  );
}

function AdminModal({ open, setIsModalOpen }: AdminModalProps) {
  const { selectedItem, setSelectedItem } = useAdminStore();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [images, setImages] = useState<RecordImagePost[]>([]);

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

  const handleOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    if (!isOpen) setSelectedItem(null);
  };

  const handleImageModalOpen = () => {
    setIsImageModalOpen(true);
  };

  const handleImageAdd = (image: Partial<RecordImagePost>) => {
    const newImage = {
      ...image,
      id: images.length,
    } as RecordImagePost;
    setImages([...images, newImage]);
  };

  const handleImageDelete = (id: number) => {
    const filteredImages = images.filter((img) => img.id !== id);
    const orderedImages = filteredImages.map((img, index) => ({
      ...img,
      id: index,
    }));
    setImages(orderedImages);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);

        // id 값만 교환
        const tempId = newItems[oldIndex].id;
        newItems[oldIndex].id = newItems[newIndex].id;
        newItems[newIndex].id = tempId;

        return newItems;
      });
    }
  };

  useEffect(() => {
    if (!open) {
      setImages([]);
    }
  }, [open]);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <form>
          <DialogContent className="w-full sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedItem ? "수정" : "생성"}</DialogTitle>
              <DialogDescription>
                {selectedItem ? "수정" : "생성"}할 내용을 입력해주세요.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">제목</Label>
                <Input
                  id="name-1"
                  name="name"
                  placeholder="제목을 입력해주세요."
                  defaultValue={selectedItem ? selectedItem.title : ""}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">내용</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="내용을 입력해주세요."
                  defaultValue={selectedItem ? selectedItem.description : ""}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="category">카테고리</Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="카테고리를 입력해주세요."
                  defaultValue={selectedItem ? selectedItem.category : ""}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="slug">슬러그</Label>
                <Input
                  id="slug"
                  name="slug"
                  placeholder="슬러그를 입력해주세요."
                  defaultValue={selectedItem ? selectedItem.slug : ""}
                />
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-4 place-items-center gap-2 rounded-md border border-gray-300 py-2 px-1">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={images.map((img) => img.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {images.map((image) => (
                        <SortableImage
                          key={image.id}
                          image={image}
                          onDelete={handleImageDelete}
                        />
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              )}

              <div className="grid gap-3">
                <Button
                  className="cursor-pointer"
                  onClick={handleImageModalOpen}
                >
                  <Plus /> 이미지 추가
                </Button>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
      <AdminImageModal
        open={isImageModalOpen}
        setIsModalOpen={setIsImageModalOpen}
        handleImageAdd={handleImageAdd}
      />
    </>
  );
}

export default AdminModal;
