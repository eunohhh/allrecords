"use client";

import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { CHECKBOX_CATEGORY } from "@/constants/allrecords.consts";
import { useRecordsQuery } from "../hooks/home.queries";
import { useHomeStore } from "../model/home.store";
import HomeCheckbox from "./home-checkbox";
import HomeGridCard from "./home-grid-card";

function HomeGrid() {
  const { category } = useHomeStore();

  const {
    data: allRecords,
    isPending,
    error,
  } = useRecordsQuery({
    page: 1,
    limit: 40,
    search: "",
    sort: "",
    order: "",
    category: category.join(","),
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
      <div className="grid grid-cols-3 justify-items-center gap-1 sm:grid-cols-4 sm:gap-4 md:grid-cols-5 lg:grid-cols-6">
        {isPending && (
          <Skeleton className="min-h-30 min-w-10 rounded-lg bg-gray-400" />
        )}
        {allRecords
          ? allRecords.map((record) => (
              <HomeGridCard key={record.id} record={record} />
            ))
          : null}
      </div>
    </section>
  );
}

export default HomeGrid;
