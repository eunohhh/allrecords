import { QUERY_KEY_ADMIN_RECORDS } from "@/constants/allrecords.consts";
import type { GetRecordsParams, Record } from "@/types/allrecords.types";
import { useQuery } from "@tanstack/react-query";
import { getAdminRecords } from "../apis/admin.apis";

export const useAdminRecordsQuery = (params: GetRecordsParams) => {
  return useQuery<Record[], Error>({
    queryKey: [QUERY_KEY_ADMIN_RECORDS],
    queryFn: () => getAdminRecords(params),
  });
};
