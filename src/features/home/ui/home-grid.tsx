"use client";

import { useEffect } from "react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { CHECKBOX_CATEGORY } from "@/constants/allrecords.consts";
import { useContentParam } from "@/hooks/use-content-param";
import { useVirtualPagination } from "@/hooks/use-virtual-pagination";
import { useFilteredRecords } from "../hooks/home.queries";
import { useHomeStore } from "../model/home.store";
import GnyangModal from "./gnyang-modal";
import HomeCheckbox from "./home-checkbox";
import HomeGridCard from "./home-grid-card";
import LoadingStar from "./loading-star";

function HomeGrid() {
  const { category } = useHomeStore();
  const { content, isOpen, setContent } = useContentParam();

  const handleClose = () => {
    setContent(null);
  };

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
    <>
      <section className="flex flex-col gap-4">
        <div className="flex flex-row justify-end gap-1 sm:gap-6">
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
            {isPending && visibleItems.length === 0 && <LoadingStar />}
            {visibleItems.map((record) => (
              <HomeGridCard key={record.id} record={record} />
            ))}
          </div>
        </InfiniteScroll>
        {hasNextPage && !isPending && (
          <div className="flex justify-center py-4">
            <LoadingStar />
          </div>
        )}
      </section>
      <GnyangModal
        slug={content}
        isOpen={isOpen}
        onClose={handleClose}
        initialRecord={visibleItems.find((record) => record.slug === content)}
      />
    </>
  );
}

export default HomeGrid;
