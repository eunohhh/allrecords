import { QUERY_KEY_RECORD } from "@/constants/allrecords.consts";
import type { Record } from "@/features/home";
import { useQuery } from "@tanstack/react-query";
import { getRecord } from "../apis/record.apis";

export const useRecordQuery = (slug: string) => {
  return useQuery<Record, Error>({
    queryKey: [QUERY_KEY_RECORD, slug],
    queryFn: () => getRecord(slug),
  });
};
