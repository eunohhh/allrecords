import api from "@/lib/utils";
import type { GetRecordsParams, Record } from "@/types/allrecords.types";

export function getAdminRecords(params: GetRecordsParams) {
  return api.get<Record[], Record[]>("/api/allrecords", { params });
}
