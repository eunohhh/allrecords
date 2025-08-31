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

export const PUBLIC_URL = process.env.NEXT_PUBLIC_URL;

export const EUN_MAIL = process.env.ADMIN_EMAIL_1;
