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
  id: string;
  url: string;
  description: string;
}

export interface RecordImagePost {
  id: number;
  file: File;
  description: string;
}
