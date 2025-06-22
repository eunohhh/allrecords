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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatDateToTZ } from "@/lib/utils";
import type { Desc } from "@/types/allrecords.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  useAdminDescMutation,
  useAdminDescsPutMutation,
} from "../hooks/admin.queries";
import { useAdminStore } from "../model/admin.store";

const formSchema = z.object({
  title: z.string().min(1),
  desc: z.string().min(1),
  is_select: z.boolean(),
});

const defaultValues = {
  title: "",
  desc: "",
  is_select: false,
};

interface AdminDescModalProps {
  open: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  desc?: Desc;
}

function AdminDescModal({ open, setIsModalOpen, desc }: AdminDescModalProps) {
  const { setSelectedDesc } = useAdminStore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      desc: "",
      is_select: false,
    },
  });

  const {
    mutate: postAdminDesc,
    isPending: isCreating,
    error: creatingError,
  } = useAdminDescMutation();

  const {
    mutate: putAdminDescs,
    isPending: isUpdating,
    error: updatingError,
  } = useAdminDescsPutMutation();

  const handleOpenChange = (isOpen: boolean) => {
    setIsModalOpen(isOpen);
    if (!isOpen) {
      form.reset(defaultValues);
      setSelectedDesc(null);
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const now = new Date();
    const newData = {
      ...data,
      category: "about", // 우선 about 카테고리로 설정
      created_at: formatDateToTZ(now),
      desc: data.desc,
      id: desc?.id ?? "",
      is_select: data.is_select,
      updated_at: formatDateToTZ(now),
    };

    if (desc) {
      putAdminDescs({ id: desc.id, data: newData });
    } else {
      postAdminDesc(newData);
    }
    toast.success("설명이 추가되었습니다.");
    form.reset(defaultValues);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!desc) return form.reset(defaultValues);
    form.reset({
      title: desc.title,
      desc: desc.desc,
      is_select: desc.is_select ?? false,
    });
  }, [desc, form]);

  useEffect(() => {
    if (open) return;
    form.reset(defaultValues);
    setSelectedDesc(null);
  }, [open, form, setSelectedDesc]);

  useEffect(() => {
    if (creatingError) {
      console.error("설명 추가에 실패했습니다.", creatingError);
      toast.error("설명 추가에 실패했습니다.");
    }
    if (updatingError) {
      console.error("설명 수정에 실패했습니다.", updatingError);
      toast.error("설명 수정에 실패했습니다.");
    }
  }, [creatingError, updatingError]);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {isCreating || isUpdating ? (
        <Loading type="partial" />
      ) : (
        <DialogContent className="w-full sm:max-w-3xl">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, (errors) => {
                console.error("Form validation errors:", errors);
                toast.error("입력값을 확인해주세요.");
              })}
              className="space-y-4"
            >
              <DialogHeader>
                <DialogTitle>{desc ? "수정" : "생성"}</DialogTitle>
                <DialogDescription className="hidden">
                  {desc ? "수정" : "생성"}할 내용을 입력해주세요.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>제목</FormLabel>
                      <FormControl>
                        <Input placeholder="제목을 입력해주세요." {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="desc"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>설명</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="설명을 입력해주세요."
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="is_select"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>선택 여부</FormLabel>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit" className="cursor-pointer">
                  Save changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      )}
    </Dialog>
  );
}

export default AdminDescModal;
