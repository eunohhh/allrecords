import type { Record } from "@/features/home";
import api from "@/lib/utils";

export function getRecord(slug: string) {
  return api.get<Record, Record>(`/api/allrecords/${slug}`);
}
