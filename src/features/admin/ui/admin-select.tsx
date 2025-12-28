"use client";

import type { ControllerRenderProps } from "react-hook-form";
import type { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHECKBOX_CATEGORY } from "@/constants/allrecords.consts";
import type { formSchema } from "../model/admin.schema";

interface AdminSelectProps {
  field: ControllerRenderProps<z.infer<typeof formSchema>, "category">;
}

function AdminSelect({ field }: AdminSelectProps) {
  return (
    <Select
      value={field.value[0] || ""}
      onValueChange={(value) => field.onChange([value])}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="카테고리를 선택해주세요." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>카테고리</SelectLabel>
          {CHECKBOX_CATEGORY.map((category) => (
            <SelectItem
              key={category.id}
              value={category.id}
              className="cursor-pointer"
            >
              {category.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default AdminSelect;
