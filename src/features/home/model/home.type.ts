import type { Tables } from "@/types/supabase";

export type Record = Tables<"allrecords">;

export interface GetRecordsParams {
  page: number;
  limit: number;
  search: string;
  sort: string;
  order: string;
  category: string;
}
