import api from "@/lib/utils";
import type { Record, RecordsParams } from "@/types/allrecords.types";

export function getAdminRecords(params: RecordsParams) {
  return api.get<Record[], Record[]>("/api/allrecords", { params });
}

export function postAdminRecords(params: RecordsParams) {
  return api.post<Record[], Record[]>("/api/allrecords", params);
}
