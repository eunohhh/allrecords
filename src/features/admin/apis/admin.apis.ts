import api from "@/lib/utils";
import type { Record, RecordsParams } from "@/types/allrecords.types";
import type { User } from "@supabase/supabase-js";

export function getAdminRecords(params: RecordsParams) {
  return api.get<Record[], Record[]>("/api/allrecords", { params });
}

export function postAdminRecords(params: Record) {
  return api.post<Record, Record>("/api/allrecords", params);
}

export function deleteAdminRecords(params: { ids: string[] }) {
  return api.post<Record[], Record[]>("/api/allrecords/delete", params);
}

export function putAdminRecords(id: string, params: RecordsParams) {
  return api.put<Record[], Record[]>(`/api/allrecords/${id}`, params);
}

export function getAdminUser() {
  return api.get<User, User>("/api/admin/user");
}
