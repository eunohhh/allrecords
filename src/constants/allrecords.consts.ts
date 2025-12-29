import { Category } from "@/types/allrecords.types";

export const QUERY_KEY_RECORDS = "records";
export const QUERY_KEY_ALL = "all";
export const QUERY_KEY_RECORD = "record";
export const QUERY_KEY_DESCS = "descs";
export const QUERY_KEY_DESC = "desc";
export const QUERY_KEY_USER = "user";
export const QUERY_KEY_ADMIN_RECORDS = "admin-records";
export const QUERY_KEY_ADMIN_DESCS = "admin-descs";

export const CHECKBOX_CATEGORY = [
  {
    label: "일상",
    id: "ilsang",
  },
  {
    label: "풀숲",
    id: "poolsoop",
  },
  {
    label: "그림",
    id: "grim",
  },
] as const;

export const DEFAULT_LIMIT = 1000;

export const DEFAULT_RECORDS_PARAMS = {
  page: 1,
  limit: DEFAULT_LIMIT,
  search: "",
  sort: "created_at",
  order: "desc",
  category: ["ilsang", "poolsoop", "grim"] as Category[],
};
