import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { QUERY_KEY_RECORDS } from "@/constants/allrecords.consts";
import type {
  Category,
  Desc,
  Record,
  RecordsParams,
} from "@/types/allrecords.types";
import { QUERY_KEY_DESC } from "./../../../constants/allrecords.consts";
import { getAllRecords, getDescs, getRecords } from "../apis/home.apis";

// 전체 레코드를 한 번에 가져오는 훅
export const useAllRecordsQuery = () => {
  return useQuery<Record[], Error>({
    queryKey: [QUERY_KEY_RECORDS, "all"],
    queryFn: () => getAllRecords(),
    staleTime: 1000 * 60 * 5, // 5분간 캐시 유지
    gcTime: 1000 * 60 * 10, // 10분간 메모리 유지
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

// 기존 API와의 호환성을 위한 레거시 훅 (사용하지 않는 것을 권장)
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
