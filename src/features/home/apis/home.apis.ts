import api from "@/lib/utils";
import type { Desc, Record, RecordsParams } from "@/types/allrecords.types";

export function getRecords(params: RecordsParams) {
  return api.get<Record[], Record[]>("/api/allrecords", { params });
}

// 전체 레코드를 가져오는 새로운 함수 (캐시용)
export function getAllRecords() {
  return api.get<Record[], Record[]>("/api/allrecords", {
    params: {
      limit: 1000, // 충분히 큰 수로 설정
      page: 1,
      category: "ilsang,poolsoop,grim", // 모든 카테고리
    },
  });
}

export function getDescs() {
  return api.get<Desc, Desc>("/api/about");
}
