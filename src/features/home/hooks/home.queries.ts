import { QUERY_KEY_RECORDS } from "@/constants/allrecords.consts";
import type { Desc, Record, RecordsParams } from "@/types/allrecords.types";
import { useQuery } from "@tanstack/react-query";
import { getDescs, getRecords } from "../apis/home.apis";
import { QUERY_KEY_DESC } from "./../../../constants/allrecords.consts";

export const useRecordsQuery = (params: RecordsParams) => {
  return useQuery<Record[], Error>({
    queryKey: [QUERY_KEY_RECORDS, params.category],
    queryFn: () => getRecords(params),
  });
};

export const useAboutQuery = () => {
  return useQuery<Desc, Error>({
    queryKey: [QUERY_KEY_DESC],
    queryFn: () => getDescs(),
  });
};
