import { QUERY_KEY_ADMIN_RECORDS } from "@/constants/allrecords.consts";
import type { Record, RecordsParams } from "@/types/allrecords.types";
import { useQuery } from "@tanstack/react-query";
import { getAdminRecords } from "../apis/admin.apis";

export const useAdminRecordsQuery = (params: RecordsParams) => {
  return useQuery<Record[], Error>({
    queryKey: [QUERY_KEY_ADMIN_RECORDS],
    queryFn: () => getAdminRecords(params),
  });
};
