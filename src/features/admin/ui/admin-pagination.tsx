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
  path: string;
}

function AdminPagination({ page, limit, total, path }: AdminPaginationProps) {
  const pageSection = Math.ceil(total / limit);
  const currentPage = page;
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === pageSection;

  const previousPage = () => {
    if (isFirstPage) return;
    return `${path}?page=${currentPage - 1}`;
  };

  const nextPage = () => {
    if (isLastPage) return;
    return `${path}?page=${currentPage + 1}`;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={previousPage()}
            className="cursor-pointer bg-white"
          />
        </PaginationItem>
        {Array.from({ length: pageSection }).map((_, index) => {
          const page = index + 1;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                href={`${path}?page=${page}`}
                isActive={page === currentPage}
                className={cn(
                  "cursor-pointer bg-white",
                  page === currentPage && "bg-primary text-white"
                )}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}
        <PaginationItem>
          <PaginationNext
            href={nextPage()}
            className="cursor-pointer bg-white"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default AdminPagination;
