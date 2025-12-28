"use client";

import { Plus, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Record } from "@/types/allrecords.types";
import type { formSchema } from "../model/admin.schema";
import AdminSelect from "./admin-select";

interface FormFieldsProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  record?: Record;
  onThumbnailModalOpen: () => void;
}

const inputNames: {
  name: "title" | "description" | "slug";
  label: string;
}[] = [
  { name: "title", label: "제목" },
  { name: "description", label: "내용" },
  { name: "slug", label: "슬러그" },
];

function TextFormFields({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  return (
    <>
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
    </>
  );
}

function CategoryFormField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  return (
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
  );
}

function NumberFormField({
  form,
  record,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  record?: Record;
}) {
  return (
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
  );
}

function KeywordFormField({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) {
  const keywords = form.watch("keywords") || [];

  const handleAddKeyword = (index: number) => {
    const newKeywords = [...keywords];
    newKeywords[index] = "";
    form.setValue("keywords", newKeywords);
  };

  const handleRemoveKeyword = (index: number) => {
    const newKeywords = keywords.filter((_, i) => i !== index);
    form.setValue("keywords", newKeywords);
  };

  const handleKeywordChange = (index: number, value: string) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    form.setValue("keywords", newKeywords);
  };

  return (
    <div className="grid gap-3">
      <FormLabel>키워드 (최대 3개, 각 5자 이하)</FormLabel>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2].map((index) => (
          <div key={`keyword-slot-${index}`} className="relative">
            {keywords[index] !== undefined ? (
              <>
                <FormField
                  control={form.control}
                  name={`keywords.${index}` as const}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder={`키워드 ${index + 1}`}
                          maxLength={5}
                          {...field}
                          className="pr-8"
                          onChange={(e) => {
                            field.onChange(e);
                            handleKeywordChange(index, e.target.value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-1 right-1 h-6 w-6 p-0 hover:bg-red-100"
                  onClick={() => handleRemoveKeyword(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full"
                onClick={() => handleAddKeyword(index)}
                disabled={keywords.length >= 3}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ThumbnailFormField({
  form,
  onThumbnailModalOpen,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  onThumbnailModalOpen: () => void;
}) {
  return (
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
                  <div className="relative inline-block w-fit">
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
                      className="absolute top-1 right-1 h-4 w-4 rounded-full p-0 has-[>svg]:px-2"
                      onClick={() => field.onChange(null)}
                    >
                      <X />
                    </Button>
                  </div>
                )}
                <Button
                  type="button"
                  className="cursor-pointer"
                  onClick={onThumbnailModalOpen}
                >
                  <Plus /> 썸네일 추가
                </Button>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
}

export function AdminFormFields({
  form,
  record,
  onThumbnailModalOpen,
}: FormFieldsProps) {
  return (
    <div className="grid gap-4">
      <TextFormFields form={form} />
      <CategoryFormField form={form} />
      <NumberFormField form={form} record={record} />
      <KeywordFormField form={form} />
      <ThumbnailFormField
        form={form}
        onThumbnailModalOpen={onThumbnailModalOpen}
      />
    </div>
  );
}

export default AdminFormFields;
