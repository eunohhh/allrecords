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
import type { RecordImagePost } from "@/types/allrecords.types";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useAdminStore } from "../model/admin.store";
import AdminImageModal from "./admin-image-modal";

interface AdminModalProps {
  open: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
}

function AdminModal({ open, setIsModalOpen }: AdminModalProps) {
  const { selectedItem, setSelectedItem } = useAdminStore();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [images, setImages] = useState<RecordImagePost[]>([]);

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
    setImages(images.filter((img) => img.id !== id));
  };

  console.log(images);

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <form>
          <DialogContent className="sm:max-w-[425px]">
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
                <Input
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
                  {images.map((image) => (
                    <div
                      key={image.id}
                      className="flex h-20 w-20 items-center justify-center rounded-md border border-gray-200"
                    >
                      <img
                        src={URL.createObjectURL(image.file)}
                        alt={image.description}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
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
