import api from "@/lib/utils";
import type { Record } from "@/types/allrecords.types";

export function getRecord(slug: string) {
  return api.get<Record, Record>(`/api/allrecords/${slug}`);
}
