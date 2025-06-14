export const QUERY_KEY_RECORDS = "records";
export const QUERY_KEY_RECORD = "record";
export const QUERY_KEY_USER = "user";

export const CHECKBOX_CATEGORY = [
  {
    label: "일상",
    id: "daily",
  },
  {
    label: "호숲",
    id: "hosoop",
  },
  {
    label: "작업",
    id: "work",
  },
] as const;

export const PUBLIC_URL = process.env.NEXT_PUBLIC_URL;
