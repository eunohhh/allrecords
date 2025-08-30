"use client";

import type { DragEndEvent } from "@dnd-kit/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
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
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateToTZ } from "@/lib/utils";
import type {
  Record,
  RecordImagePost,
  RecordPost,
} from "@/types/allrecords.types";
import {
  useAdminRecordsMutation,
  useAdminRecordsPutMutation,
  useLastNumberQuery,
} from "../hooks/admin.queries";
import { formSchema } from "../model/admin.schema";
import { useAdminStore } from "../model/admin.store";
import AdminFormFields from "./admin-form-fields";
import AdminImageModal from "./admin-image-modal";
import AdminImageSection from "./admin-image-section";

const defaultValues = {
  title: "",
  description: "",
  category: [] as ("poolsoop" | "ilsang" | "grim")[],
  slug: "",
  keywords: [] as string[],
  images: [],
  thumbnail: null as string | File | null,
};

interface AdminModalProps {
  open: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  record?: Record;
}

function AdminRecordsModal({ open, setIsModalOpen, record }: AdminModalProps) {
  const { setSelectedItem } = useAdminStore();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isThumbnailModalOpen, setIsThumbnailModalOpen] = useState(false);
  const {
    mutate: postAdminRecords,
    isPending: isCreating,
    error: creatingError,
  } = useAdminRecordsMutation();
  const {
    mutate: putAdminRecords,
    isPending: isUpdating,
    error: updatingError,
  } = useAdminRecordsPutMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: record?.title || "",
      description: record?.description || "",
      category: record?.category ? [record.category] : [],
      slug: record?.slug || "",
      keywords: (record?.keywords as string[]) || [],
      images: (record?.images as unknown as RecordImagePost[]) || [],
      thumbnail: record?.thumbnail || null,
    },
  });

  // 현재 선택된 카테고리 가져오기
  const selectedCategory = form.watch("category")[0];

  // 선택된 카테고리의 마지막 순서 번호 가져오기
  const { data: lastNumberData } = useLastNumberQuery(selectedCategory || "");

  const { fields, remove, move } = useFieldArray({
    control: form.control,
    name: "images",
  });

  const handleOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      form.reset(defaultValues);
      setSelectedItem(null);
    }
  };

  const handleImageModalOpen = () => {
    setIsImageModalOpen(true);
  };

  const handleThumbnailModalOpen = () => {
    setIsThumbnailModalOpen(true);
  };

  const handleImageDelete = (id: number) => {
    const index = fields.findIndex((field) => field.id === id);
    if (index !== -1) {
      remove(index);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);

      move(oldIndex, newIndex);
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const now = new Date();
    const newRecord: RecordPost = {
      ...data,
      category: data.category[0] || null,
      keywords: data.keywords.filter((keyword) => keyword.trim() !== ""), // 빈 키워드 제거
      created_at: formatDateToTZ(now),
      updated_at: formatDateToTZ(now),
      images: data.images.map((image) => ({
        id: image.id,
        url: image.file ? "" : image.url,
        file: image.file ? image.file : null,
        desc: image.desc,
      })),
      number: data.number,
      thumbnail: data.thumbnail || null,
    };
    console.log("New record:", newRecord);
    if (record) {
      putAdminRecords({ id: record.id, data: newRecord });
    } else {
      postAdminRecords(newRecord);
    }
    toast.success(record ? "글이 수정되었습니다." : "글이 추가되었습니다.");
    form.reset(defaultValues);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!record) return form.reset(defaultValues);

    const images =
      record.images && record.images.length > 0
        ? (record.images as unknown as RecordImagePost[])
        : [];
    form.reset({
      title: record.title,
      description: record.description,
      category: record.category ? [record.category] : [],
      slug: record.slug,
      keywords: (record.keywords as string[]) || [],
      images,
      thumbnail: record.thumbnail || null, // 기존 thumbnail URL 유지
    });
  }, [record, form]);

  // 카테고리가 변경될 때 자동으로 다음 순서 설정 (새 글 생성 시에만)
  useEffect(() => {
    if (record) return; // 수정 모드에서는 순서를 자동 설정하지 않음

    if (selectedCategory && lastNumberData?.nextNumber) {
      form.setValue("number", lastNumberData.nextNumber);
    }
  }, [selectedCategory, lastNumberData, form, record]);

  useEffect(() => {
    if (open) return;
    form.reset(defaultValues);
    setSelectedItem(null);
  }, [open, form, setSelectedItem]);

  useEffect(() => {
    if (creatingError) {
      console.error("글 추가에 실패했습니다.", creatingError);
      toast.error("글 추가에 실패했습니다.");
    }
    if (updatingError) {
      console.error("글 수정에 실패했습니다.", updatingError);
      toast.error("글 수정에 실패했습니다.");
    }
  }, [creatingError, updatingError]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {isCreating || isUpdating ? (
        <div className="flex h-full items-center justify-center">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      ) : (
        <>
          <DialogContent className="max-h-[90vh] w-full p-0 sm:max-w-3xl">
            <div className="flex h-full max-h-[80vh] flex-col overflow-y-auto">
              <DialogHeader className="px-6 pt-6">
                <DialogTitle>{record ? "수정" : "생성"}</DialogTitle>
                <DialogDescription className="hidden">
                  {record ? "수정" : "생성"}할 내용을 입력해주세요.
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="flex-1 px-6">
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit, (errors) => {
                      console.error("Form validation errors:", errors);
                      toast.error("입력값을 확인해주세요.");
                    })}
                    className="space-y-4 py-4"
                  >
                    <AdminFormFields
                      form={form}
                      record={record}
                      onThumbnailModalOpen={handleThumbnailModalOpen}
                    />
                    <AdminImageSection
                      fields={fields}
                      onImageModalOpen={handleImageModalOpen}
                      onImageDelete={handleImageDelete}
                      onDragEnd={handleDragEnd}
                    />
                  </form>
                </Form>
              </ScrollArea>
              <DialogFooter className="px-6 pb-6">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="cursor-pointer"
                  onClick={form.handleSubmit(onSubmit, (errors) => {
                    console.error("Form validation errors:", errors);
                    toast.error("입력값을 확인해주세요.");
                  })}
                >
                  Save changes
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
          <AdminImageModal
            open={isImageModalOpen}
            setIsModalOpen={setIsImageModalOpen}
            form={form}
          />
          <AdminImageModal
            open={isThumbnailModalOpen}
            setIsModalOpen={setIsThumbnailModalOpen}
            form={form}
            mode="thumbnail"
          />
        </>
      )}
    </Dialog>
  );
}

export default AdminRecordsModal;
