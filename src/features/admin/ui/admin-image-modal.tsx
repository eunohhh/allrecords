"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RecordImagePost } from "@/types/allrecords.types";
import { Image, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AdminImageModalProps {
  open: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  handleImageAdd: (image: Partial<RecordImagePost>) => void;
}

function AdminImageModal({
  open,
  setIsModalOpen,
  handleImageAdd,
}: AdminImageModalProps) {
  const [imageDescription, setImageDescription] = useState("");
  const [image, setImage] = useState<{
    url: string;
    file: File;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage({ url: URL.createObjectURL(file), file });
    }
  };

  const handleImageAddButtonClick = () => {
    inputRef.current?.click();
  };

  const handleImageDeleteButtonClick = () => {
    if (inputRef.current?.files?.[0]) {
      setImage(null);
      inputRef.current!.value = "";
    }
  };

  const handleSubmit = () => {
    handleImageAdd({
      file: image?.file,
      description: imageDescription,
    });
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!open) {
      setImage(null);
      setImageDescription("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setIsModalOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>이미지 추가</DialogTitle>
          <DialogDescription className="hidden">
            이미지를 추가해주세요.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center">
          {image && (
            <div className="relative flex items-center justify-center gap-2">
              <img
                src={image.url}
                alt="이미지"
                className="h-40 w-40 object-cover"
              />
              <Button
                variant="secondary"
                className="absolute right-0 top-0 h-5 w-5 cursor-pointer"
                onClick={handleImageDeleteButtonClick}
              >
                <X />
              </Button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleAddImage}
            className="hidden"
            ref={inputRef}
          />
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={handleImageAddButtonClick}
          >
            <Image />
            <span>이미지 추가</span>
          </Button>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="image">이미지 설명</Label>
          <Input
            id="image"
            name="image"
            placeholder="이미지 설명을 입력해주세요."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            onChange={(e) => setImageDescription(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="cursor-pointer">
            추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AdminImageModal;
