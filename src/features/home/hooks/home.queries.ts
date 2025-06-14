import { QUERY_KEY_RECORDS } from "@/constants/allrecords.consts";
import type { GetRecordsParams, Record } from "@/types/allrecords.types";
import { useQuery } from "@tanstack/react-query";
import { getRecords } from "../apis/home.apis";

export const useRecordsQuery = (params: GetRecordsParams) => {
  return useQuery<Record[], Error>({
    queryKey: [QUERY_KEY_RECORDS, params.category],
    queryFn: () => getRecords(params),
  });
};
