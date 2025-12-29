"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, Loader2 } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import Loading from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CHECKBOX_CATEGORY } from "@/constants/allrecords.consts";
import { cn } from "@/lib/utils";
import { Category } from "@/types/allrecords.types";
import {
  useAdminRecordsQuery,
  useAdminRecordsReorderMutation,
} from "../hooks/admin.queries";
import { recordsColumns } from "../model/admin.columns";
import { useAdminStore } from "../model/admin.store";
import AdminCheckbox from "./admin-checkbox";
import AdminPagination from "./admin-pagination";

// Sortable Table Row Component
function SortableTableRow({
  row,
  children,
}: {
  row: any;
  children: React.ReactNode;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: row.id,
    });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={row.getIsSelected() && "selected"}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      {children}
    </TableRow>
  );
}

const switchColumnIdToKorean = (id: string) => {
  switch (id) {
    case "category":
      return "카테고리";
    case "title":
      return "제목";
    case "created_at":
      return "생성일";
    case "updated_at":
      return "수정일";
    default:
      return id;
  }
};

function AdminRecordsDatatable() {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 드래그해야 드래그 시작
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const [page, setPage] = useQueryState("page", parseAsInteger);
  const { category } = useAdminStore();

  const {
    data: recordsData,
    isPending,
    error,
  } = useAdminRecordsQuery({
    category: category,
    page: 1,
    limit: 1000, // 전체 데이터를 가져와서 클라이언트에서 페이지네이션
    search: "",
    sort: "created_at",
    order: "desc",
  });

  const {
    mutate: reorderRecords,
    isPending: isReordering,
    error: reorderError,
  } = useAdminRecordsReorderMutation();
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "category",
      desc: false,
    },
    {
      id: "number",
      desc: true,
    },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const table = useReactTable({
    data: recordsData ?? [],
    columns: recordsColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: (page ?? 1) - 1,
        pageSize: 10,
      },
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const activeRow = table
        .getRowModel()
        .rows.find((row) => row.id === active.id);
      const overRow = table
        .getRowModel()
        .rows.find((row) => row.id === over.id);

      if (
        activeRow &&
        overRow &&
        activeRow.original.category === overRow.original.category
      ) {
        // 같은 카테고리 내에서만 순서 변경 가능
        // 현재 테이블에서 같은 카테고리의 레코드들만 필터링
        const categoryRows = table
          .getRowModel()
          .rows.filter(
            (row) => row.original.category === activeRow.original.category
          );

        // 필터링된 배열에서 인덱스 계산
        const oldIndex = categoryRows.findIndex((row) => row.id === active.id);
        const newIndex = categoryRows.findIndex((row) => row.id === over.id);

        // API 호출로 순서 업데이트
        reorderRecords({
          activeId: activeRow.original.id,
          overId: overRow.original.id,
          activeCategory: activeRow.original.category as Category,
          oldIndex,
          newIndex,
        });
      } else {
        toast.error("같은 카테고리 내에서만 순서를 변경할 수 있습니다.");
      }
    }
  };

  useEffect(() => {
    if (page) return;
    setPage(1);
  }, [page, setPage]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching records:", error);
      toast.error("글 목록 조회에 실패했습니다.");
    }
  }, [error]);

  useEffect(() => {
    if (reorderError) {
      console.error("Error reordering records:", reorderError);
      toast.error("순서 변경에 실패했습니다.");
    }
  }, [reorderError]);

  if (isPending) return <Loading type="partial" />;

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col gap-2">
        <div className="flex flex-row justify-end gap-2">
          {CHECKBOX_CATEGORY.map((category) => (
            <AdminCheckbox
              key={category.id}
              label={category.label}
              id={category.id}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center py-2">
        <Input
          placeholder="Filter titles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
          className="max-w-sm bg-white"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto bg-white">
              열 선택 <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {switchColumnIdToKorean(column.id)}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <SortableContext
              items={table.getRowModel().rows.map((row) => row.id)}
              strategy={verticalListSortingStrategy}
            >
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <SortableTableRow key={row.id} row={row}>
                      {row.getVisibleCells().map((cell, idx) => (
                        <TableCell
                          key={cell.id}
                          className={cn(idx === 3 && "pl-6")}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </SortableTableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={recordsColumns.length}
                      className="h-24 text-center"
                    >
                      <div className="flex items-center justify-center">
                        <Loader2 className="mr-3 size-5 animate-spin" />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </SortableContext>
          </Table>
        </div>
      </DndContext>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-muted-foreground text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <AdminPagination
            page={page ?? 1}
            limit={10}
            total={table.getFilteredRowModel().rows.length}
            onPageChange={setPage}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminRecordsDatatable;
