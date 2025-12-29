import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import {
  DEFAULT_RECORDS_PARAMS,
  QUERY_KEY_ALL,
  QUERY_KEY_RECORDS,
} from "@/constants/allrecords.consts";
import type { Category, Desc, Record } from "@/types/allrecords.types";
import { QUERY_KEY_DESC } from "./../../../constants/allrecords.consts";
import { getDescs, getRecords } from "../apis/home.apis";

// 전체 레코드를 한 번에 가져오는 훅
export const useAllRecordsQuery = () => {
  return useQuery<Record[], Error>({
    queryKey: [QUERY_KEY_RECORDS, QUERY_KEY_ALL],
    queryFn: async () => {
      const data = await getRecords(DEFAULT_RECORDS_PARAMS);
      // return shuffleArray(data);
      return data;
    },
  });
};

// 필터링된 레코드를 반환하는 훅
export const useFilteredRecords = (selectedCategories: Category[]) => {
  const { data: allRecords, isLoading, error } = useAllRecordsQuery();

  const filteredRecords = useMemo(() => {
    if (!allRecords) return [];

    // 모든 카테고리가 선택된 경우 전체 반환
    if (selectedCategories.length === 3) {
      return allRecords;
    }

    // 선택된 카테고리로 필터링
    return allRecords.filter(
      (record) =>
        record.category &&
        selectedCategories.includes(record.category as Category)
    );
  }, [allRecords, selectedCategories]);

  return {
    data: filteredRecords,
    isLoading,
    error,
  };
};

export const useAboutQuery = () => {
  return useQuery<Desc, Error>({
    queryKey: [QUERY_KEY_DESC],
    queryFn: () => getDescs(),
  });
};
