"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Desc, Record } from "@/types/allrecords.types";
import {
  useAdminDescsDeleteMutation,
  useAdminRecordsDeleteMutation,
} from "../hooks/admin.queries";
import { useAdminStore } from "./admin.store";

const {
  setSelectedItems,
  deleteSelectedItems,
  setSelectedItem,
  setSelectedDescs,
  deleteSelectedDescs,
  setSelectedDesc,
} = useAdminStore.getState();

export const recordsColumns: ColumnDef<Record>[] = [
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
    accessorKey: "number",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          순서
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <div>{row.getValue("number")}</div>,
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
            className="h-8 w-8 cursor-pointer p-0"
            onClick={handleDeleteRecord}
          >
            <Trash2 />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 cursor-pointer p-0"
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

export const aboutColumns: ColumnDef<Desc>[] = [
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
            setSelectedDescs(row.original);
          } else {
            deleteSelectedDescs(row.original);
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
    accessorKey: "is_select",
    header: () => <div>선택</div>,
    cell: ({ row }) => <div>{row.getValue("is_select") ? "O" : "X"}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const record = row.original;
      const { mutate: deleteDescs } = useAdminDescsDeleteMutation();
      const handleDeleteDesc = () => deleteDescs([record.id]);

      return (
        <div>
          <Button
            variant="ghost"
            className="h-8 w-8 cursor-pointer p-0"
            onClick={handleDeleteDesc}
          >
            <Trash2 />
          </Button>
          <Button
            variant="ghost"
            className="h-8 w-8 cursor-pointer p-0"
            onClick={() => {
              setSelectedDesc(record);
            }}
          >
            <Pencil />
          </Button>
        </div>
      );
    },
  },
];
