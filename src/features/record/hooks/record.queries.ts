import { useQuery } from "@tanstack/react-query";
import { QUERY_KEY_RECORD } from "@/constants/allrecords.consts";
import type { Record } from "@/types/allrecords.types";
import { getRecord } from "../apis/record.apis";

export const useRecordQuery = (slug: string) => {
  return useQuery<Record, Error>({
    queryKey: [QUERY_KEY_RECORD, slug],
    queryFn: () => getRecord(slug),
    enabled: !!slug, // slug가 있을 때만 쿼리 실행
  });
};
