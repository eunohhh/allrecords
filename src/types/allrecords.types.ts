import type { Tables } from "@/types/supabase";
import { z } from "zod";

export type Record = Tables<"allrecords">;

export interface RecordsParams {
  page: number;
  limit: number;
  search: string;
  sort: string;
  order: string;
  category: string;
}

export interface RecordImage {
  id: number;
  url: string;
  desc: string;
}

export interface RecordImagePost {
  id: number;
  file?: File | null;
  url?: string;
  desc: string;
}

export interface RecordPost
  extends Pick<
    Record,
    "created_at" | "updated_at" | "title" | "description" | "category" | "slug"
  > {
  images: RecordImagePost[];
}

export type Desc = Tables<"descs">;

export interface DescsParams {
  page: number;
  limit: number;
  search: string;
  sort: string;
  order: string;
  category: string;
}

export type Token = Tables<"token">;

// Zod 스키마 정의
export const inquiryFormSchema = z.object({
  name: z
    .string()
    .min(2, "이름은 최소 2자 이상이어야 합니다.")
    .max(50, "이름은 50자를 초과할 수 없습니다."),
  email: z
    .string()
    .email("올바른 이메일 주소를 입력해주세요.")
    .min(1, "이메일은 필수 항목입니다."),
  message: z
    .string()
    .min(10, "메시지는 최소 10자 이상이어야 합니다.")
    .max(1000, "메시지는 1000자를 초과할 수 없습니다."),
});

export type InquiryFormValues = z.infer<typeof inquiryFormSchema>;
