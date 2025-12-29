"use client";

import { useEffect, useRef } from "react";
import InfiniteScroll from "@/components/ui/infinite-scroll";
import { CHECKBOX_CATEGORY } from "@/constants/allrecords.consts";
import { env } from "@/env/t3-env";
import { useContentParam } from "@/hooks/use-content-param";
import { useVirtualPagination } from "@/hooks/use-virtual-pagination";
import GnyangModal from "../../common/ui/gnyang-modal";
import { useFilteredRecords } from "../hooks/home.queries";
import { useHomeStore } from "../model/home.store";
import HomeCheckbox from "./home-checkbox";
import HomeGridCard from "./home-grid-card";
import LoadingStar from "./loading-star";

export const PRELOAD_COUNT = 6;
export const PRELOAD_WIDTH = 750;
export const PRELOAD_QUALITY = 50;

/**
 * Next.js Image Optimization API URL을 생성합니다.
 * @param src - 원본 이미지 URL
 * @param width - 이미지 너비 (px)
 * @param quality - 이미지 품질 (0-100)
 * @returns Next.js Image Optimization API URL
 * @example
 * buildImageUrl("https://example.com/image.jpg", 750, 50)
 * // => "https://yourdomain.com/_next/image?url=https%3A%2F%2Fexample.com%2Fimage.jpg&w=750&q=50"
 */
export function buildImageUrl(src: string, width: number, quality: number) {
  const encodedUrl = encodeURIComponent(src);
  const url = `${env.NEXT_PUBLIC_URL}/_next/image?url=${encodedUrl}&w=${width}&q=${quality}`;
  return url;
}

function HomeGrid() {
  const { category } = useHomeStore();
  const { content, isOpen, setContent } = useContentParam();
  const loadedImageUrls = useRef(new Set<string>());
  const prevCategoryKeyRef = useRef<string | null>(null);
  const categoryKey = category.join("|");

  const {
    data: allRecords = [],
    isLoading: isPending,
    error,
  } = useFilteredRecords(category);

  const { visibleItems, hasNextPage, fetchNextPage } = useVirtualPagination({
    items: allRecords,
    itemsPerPage: 24, // 초기 로드 수 (2-3 스크린 분량)
  });

  const handleClose = () => {
    setContent(null);
  };

  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useEffect(() => {
    if (prevCategoryKeyRef.current === null) {
      prevCategoryKeyRef.current = categoryKey;
      return;
    }
    if (prevCategoryKeyRef.current === categoryKey) return;
    prevCategoryKeyRef.current = categoryKey;
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [categoryKey]);

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
              <HomeGridCard
                key={record.id}
                record={record}
                loadedImageUrls={loadedImageUrls.current}
              />
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
        loadedImageUrls={loadedImageUrls.current}
      />
    </>
  );
}

export default HomeGrid;
