"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Record } from "@/types/allrecords.types";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { useAdminRecordsDeleteMutation } from "../hooks/admin.queries";
import { useAdminStore } from "./admin.store";

const { setSelectedItems, deleteSelectedItems, setSelectedItem } =
  useAdminStore.getState();

export const columns: ColumnDef<Record>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ table, row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => {
          if (value) {
            setSelectedItems(row.original);
          } else {
            deleteSelectedItems(row.original);
          }
          row.toggleSelected(!!value);
        }}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          카테고리
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          제목
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          생성일
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>{format(row.getValue("created_at"), "yyyy-MM-dd HH:mm")}</div>
    ),
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          수정일
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div>{format(row.getValue("updated_at"), "yyyy-MM-dd HH:mm")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const record = row.original;

      const { mutate: deleteRecords } = useAdminRecordsDeleteMutation();

      const handleDeleteRecord = () => deleteRecords([record.id]);

      return (
        <div>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 cursor-pointer"
            onClick={handleDeleteRecord}
          >
            <Trash2 />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 cursor-pointer"
            onClick={() => {
              setSelectedItem(record);
            }}
          >
            <Pencil />
          </Button>
        </div>
      );
    },
  },
];
