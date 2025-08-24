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
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
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
import AdminImageModal from "./admin-image-modal";
import AdminSelect from "./admin-select";
import AdminSortableImage from "./admin-sortable-image";

const inputNames: {
  name: "title" | "description" | "slug";
  label: string;
}[] = [
  { name: "title", label: "제목" },
  { name: "description", label: "내용" },
  { name: "slug", label: "슬러그" },
];

const defaultValues = {
  title: "",
  description: "",
  category: [] as ("poolsoop" | "ilsang" | "grim")[],
  slug: "",
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: record?.title || "",
      description: record?.description || "",
      category: record?.category ? [record.category] : [],
      slug: record?.slug || "",
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
                    <div className="grid gap-4">
                      {inputNames.map((input) => (
                        <div className="grid gap-3" key={input.name}>
                          <FormField
                            control={form.control}
                            name={input.name}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{input.label}</FormLabel>
                                <FormControl>
                                  {input.name === "description" ? (
                                    <Textarea
                                      placeholder={`${input.label}을 입력해주세요.`}
                                      {...field}
                                    />
                                  ) : (
                                    <Input
                                      placeholder={`${input.label}을 입력해주세요.`}
                                      {...field}
                                    />
                                  )}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      ))}

                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>카테고리</FormLabel>
                              <FormControl>
                                <AdminSelect field={field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        defaultValue={record?.number || 1}
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>순서</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="grid gap-3">
                        <FormField
                          control={form.control}
                          name="thumbnail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>썸네일 이미지</FormLabel>
                              <FormControl>
                                <div className="flex flex-col gap-2">
                                  {field.value && (
                                    <div className="relative inline-block">
                                      <img
                                        src={
                                          typeof field.value === "string"
                                            ? field.value
                                            : URL.createObjectURL(field.value)
                                        }
                                        alt="썸네일 미리보기"
                                        className="h-20 w-20 rounded-md object-contain"
                                      />
                                      <Button
                                        type="button"
                                        variant="secondary"
                                        size="sm"
                                        className="-top-2 -right-2 absolute h-6 w-6 rounded-full p-0"
                                        onClick={() => field.onChange(null)}
                                      >
                                        <X />
                                      </Button>
                                    </div>
                                  )}
                                  <Button
                                    type="button"
                                    className="cursor-pointer"
                                    onClick={handleThumbnailModalOpen}
                                  >
                                    <Plus /> 썸네일 추가
                                  </Button>
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>

                      {fields.length > 0 && (
                        <div className="grid grid-cols-4 place-items-center gap-2 rounded-md border border-gray-300 px-1 py-2">
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                          >
                            <SortableContext
                              items={fields.map((field) => field.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              {fields.map((field) => (
                                <AdminSortableImage
                                  key={field.id}
                                  image={field}
                                  onDelete={handleImageDelete}
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
                          onClick={handleImageModalOpen}
                        >
                          <Plus /> 이미지 추가
                        </Button>
                      </div>
                    </div>
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
