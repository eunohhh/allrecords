import api from "@/lib/utils";
import type { GetRecordsParams, Record } from "../model/home.type";

export function getRecords(params: GetRecordsParams) {
  return api.get<Record[], Record[]>("/api/allrecords", { params });
}
