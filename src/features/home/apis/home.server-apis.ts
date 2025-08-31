import serverApi from "@/lib/server-utils";
import { Record } from "@/types/allrecords.types";

// 전체 레코드를 가져오는 새로운 함수 서버용
export function getAllRecordsServer() {
  return serverApi.get<Record[], Record[]>("/api/allrecords", {
    params: {
      limit: 1000, // 충분히 큰 수로 설정
      page: 1,
      category: "ilsang,poolsoop,grim", // 모든 카테고리
    },
  });
}
