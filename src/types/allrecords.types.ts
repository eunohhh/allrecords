import type { Tables } from "@/types/supabase";

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
  file?: File;
  url?: string;
  description: string;
}

export interface RecordPost
  extends Pick<
    Record,
    "created_at" | "updated_at" | "title" | "description" | "category" | "slug"
  > {
  images: RecordImagePost[];
}
