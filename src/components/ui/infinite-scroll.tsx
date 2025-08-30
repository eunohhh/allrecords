"use client";

import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollProps {
  fetchNextPage: () => void;
  hasNextPage: boolean;
  children: React.ReactNode;
  className?: string;
  threshold?: number;
}

function InfiniteScroll({
  fetchNextPage,
  hasNextPage,
  children,
  className = "h-[20px]",
  threshold = 0,
}: InfiniteScrollProps) {
  const { ref, inView } = useInView({ 
    threshold,
    rootMargin: "100px" // 뷰포트에서 100px 전에 미리 로드
  });

  useEffect(() => {
    if (!(inView && hasNextPage)) return;
    fetchNextPage();
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <>
      {children}
      {hasNextPage && <div className={className} ref={ref} />}
    </>
  );
}

export default InfiniteScroll;
