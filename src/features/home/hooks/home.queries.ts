import { QUERY_KEY_RECORDS } from "@/constants/allrecords.consts";
import { useQuery } from "@tanstack/react-query";
import { getRecords } from "../apis/home.apis";
import type { GetRecordsParams, Record } from "../model/home.type";

export const useRecordsQuery = (params: GetRecordsParams) => {
  return useQuery<Record[], Error>({
    queryKey: [QUERY_KEY_RECORDS],
    queryFn: () => getRecords(params),
  });
};
