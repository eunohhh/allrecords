import api from "@/lib/utils";
import type { Record, RecordsParams } from "@/types/allrecords.types";

export function getRecords(params: RecordsParams) {
  return api.get<Record[], Record[]>("/api/allrecords", { params });
}
