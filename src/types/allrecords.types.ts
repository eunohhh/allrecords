import { z } from "zod";
import type { Database, Tables } from "@/types/supabase";

export type Record = Tables<"allrecords">;

export interface RecordsParams {
  page: number;
  limit: number;
  search: string;
  sort: string;
  order: string;
  category: Category[];
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
    | "created_at"
    | "updated_at"
    | "title"
    | "description"
    | "category"
    | "slug"
    | "number"
  > {
  keywords: string[];
  images: RecordImagePost[];
  thumbnail: File | string | null;
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

export interface ReorderParams {
  activeId: string;
  overId: string;
  activeCategory: Category;
  oldIndex: number;
  newIndex: number;
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

export interface HealthCheckResponse {
  id: string;
  expires_in: number;
  app_id: number;
}

export interface RefreshTokenResponse {
  token_type: string;
  access_token: string;
  id_token?: string;
  expires_in: number;
  refresh_token?: string;
  refresh_token_expires_in?: number;
}

export interface MessageResponse {
  result_code: number;
}

export interface Friend {
  id: number;
  uuid: string;
  favorite: boolean;
  profile_nickname: string;
  profile_thumbnail_image: string;
}

export interface KakaoFriendListResponse {
  elements: Friend[];
  total_count: number;
  before_url: string;
  after_url: string;
  favorite_count: number;
}

export type TemplateObject = globalThis.Record<
  string,
  string | { web_url: string }
>;

export interface MessageRequest {
  receiver_uuids: string[];
  template_object: TemplateObject;
  template_id?: string;
  template_args?: {
    name: string;
    email: string;
    message: string;
  };
}

export interface MessageResponse {
  successful_receiver_uuids: string[];
  failure_info: {
    code: number;
    msg: string;
    receiver_uuid: string[];
  }[];
}

export type Category = Database["public"]["Enums"]["records"];

export const Categories = ["poolsoop", "ilsang", "grim"] as const;
