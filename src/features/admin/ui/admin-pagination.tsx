"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface AdminPaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
}

function AdminPagination({
  page,
  limit,
  total,
  onPageChange,
}: AdminPaginationProps) {
  const pageSection = Math.ceil(total / limit) || 1;
  const currentPage = page;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageSection;

  const handlePageClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    pageNum: number
  ) => {
    e.preventDefault();
    onPageChange(pageNum);
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => !isFirstPage && handlePageClick(e, currentPage - 1)}
            className={cn(
              "cursor-pointer bg-white",
              isFirstPage && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
        {Array.from({ length: pageSection }).map((_, index) => {
          const pageNum = index + 1;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                href="#"
                onClick={(e) => handlePageClick(e, pageNum)}
                isActive={pageNum === currentPage}
                className={cn(
                  "cursor-pointer bg-white",
                  pageNum === currentPage && "bg-primary text-white"
                )}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => !isLastPage && handlePageClick(e, currentPage + 1)}
            className={cn(
              "cursor-pointer bg-white",
              isLastPage && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default AdminPagination;
