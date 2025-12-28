import api from "@/lib/utils";
import type { Desc, Record, RecordsParams } from "@/types/allrecords.types";

export function getRecords(params?: RecordsParams) {
  return api.get<Record[], Record[]>("/api/allrecords", { params });
}

export function getDescs() {
  return api.get<Desc, Desc>("/api/about");
}
