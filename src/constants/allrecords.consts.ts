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

export const PRELOAD_COUNT = 6;

/**
 * Next.js 기본 deviceSizes (next/image의 fill + sizes 조합에서 사용되는 후보 폭들)
 * - 참고: scripts/warmup-images.ts 에서도 동일 후보를 사용 중
 */
export const NEXT_IMAGE_DEVICE_SIZES = [
  640, 750, 828, 1080, 1200, 1920, 2048, 3840,
] as const;

/**
 * 프리로드 시 사용할 기본 품질 (next.config.ts 의 images.qualities 범위 내)
 */
export const PRELOAD_DEFAULT_QUALITY = 75;

/**
 * next/image 의 sizes 속성 값
 */
export const IMAGE_SIZES =
  "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
