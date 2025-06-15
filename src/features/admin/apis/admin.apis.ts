import api from "@/lib/utils";
import type {
  Record,
  RecordPost,
  RecordsParams,
} from "@/types/allrecords.types";
import type { User } from "@supabase/supabase-js";

export function getAdminRecords(params: RecordsParams) {
  return api.get<Record[], Record[]>("/api/allrecords", { params });
}

export const postAdminRecords = async (formData: FormData) => {
  return api.post<Record, Record>("/api/allrecords", formData);
};

export const deleteAdminRecords = async (params: { ids: string[] }) => {
  return api.post<Record[], Record[]>("/api/allrecords/delete", params);
};

export function putAdminRecords(id: string, data: RecordPost) {
  return api.put<Record[], Record[]>(`/api/allrecords/${id}`, data);
}

export function getAdminUser() {
  return api.get<User, User>("/api/admin/user");
}
