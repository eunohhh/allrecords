"use client";

import { useEffect } from "react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { Skeleton } from "@/components/ui/skeleton";
import { CHECKBOX_CATEGORY } from "@/constants/allrecords.consts";
import { useVirtualPagination } from "@/hooks/use-virtual-pagination";
import { useFilteredRecords } from "../hooks/home.queries";
import { useHomeStore } from "../model/home.store";
import HomeCheckbox from "./home-checkbox";
import HomeGridCard from "./home-grid-card";

function HomeGrid() {
  const { category } = useHomeStore();

  const {
    data: allRecords = [],
    isLoading: isPending,
    error,
  } = useFilteredRecords(category);

  const { visibleItems, hasNextPage, fetchNextPage } = useVirtualPagination({
    items: allRecords,
    itemsPerPage: 24, // 초기 로드 수 (2-3 스크린 분량)
  });

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-row justify-end gap-6">
        {CHECKBOX_CATEGORY.map((category) => (
          <HomeCheckbox
            key={category.id}
            label={category.label}
            id={category.id}
          />
        ))}
      </div>
      <InfiniteScroll
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage && !isPending}
      >
        <div className="grid grid-cols-3 justify-items-center gap-1 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
          {isPending && visibleItems.length === 0 && (
            <Skeleton className="min-h-30 min-w-10 rounded-lg bg-gray-400" />
          )}
          {visibleItems.map((record) => (
            <HomeGridCard key={record.id} record={record} />
          ))}
        </div>
      </InfiniteScroll>
      {hasNextPage && !isPending && (
        <div className="flex justify-center py-4">
          <Skeleton className="h-8 w-24 bg-gray-200" />
        </div>
      )}
    </section>
  );
}

export default HomeGrid;
