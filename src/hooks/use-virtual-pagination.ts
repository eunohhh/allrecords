import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface UseVirtualPaginationProps<T> {
  items: T[];
  itemsPerPage: number;
}

export function useVirtualPagination<T>({
  items,
  itemsPerPage,
}: UseVirtualPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const prevItemsLengthRef = useRef(items.length);

  // 현재까지 보여줄 아이템들
  const visibleItems = useMemo(() => {
    return items.slice(0, currentPage * itemsPerPage);
  }, [items, currentPage, itemsPerPage]);

  // 더 보여줄 아이템이 있는지 확인
  const hasNextPage = useMemo(() => {
    return visibleItems.length < items.length;
  }, [visibleItems.length, items.length]);

  // 다음 페이지 로드
  const fetchNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage]);

  // items가 변경되면 페이지 리셋 (필터링 시)
  useEffect(() => {
    if (prevItemsLengthRef.current !== items.length) {
      setCurrentPage(1);
      prevItemsLengthRef.current = items.length;
    }
  }, [items.length]);

  return {
    visibleItems,
    hasNextPage,
    fetchNextPage,
    currentPage,
  };
}
