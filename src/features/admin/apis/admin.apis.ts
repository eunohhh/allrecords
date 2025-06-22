import api from "@/lib/utils";
import type {
  Desc,
  DescsParams,
  Record,
  RecordsParams,
} from "@/types/allrecords.types";
import type { User } from "@supabase/supabase-js";

export function getAdminRecords(params: RecordsParams) {
  return api.get<Record[], Record[]>("/api/allrecords", { params });
}

export function postAdminRecords(formData: FormData) {
  return api.post<Record, Record>("/api/allrecords", formData);
}

export function deleteAdminRecords(params: { ids: string[] }) {
  return api.post<Record[], Record[]>("/api/allrecords/delete", params);
}

export function putAdminRecords(id: string, formData: FormData) {
  return api.put<Record[], Record[]>(`/api/allrecords/${id}`, formData);
}

export function getUser() {
  return api.get<User, User>("/api/auth/user");
}

export function getAdminDescs(params: DescsParams) {
  return api.get<Desc[], Desc[]>("/api/descs", { params });
}

export function postAdminDescs(data: Desc) {
  return api.post<Desc, Desc>("/api/descs", data);
}

export function deleteAdminDescs(params: { ids: string[] }) {
  return api.post<Desc[], Desc[]>("/api/descs/delete", params);
}

export function putAdminDescs(id: string, data: Desc) {
  return api.put<Desc[], Desc[]>(`/api/descs/${id}`, data);
}
