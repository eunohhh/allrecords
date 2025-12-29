"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { useHomeStore } from "../model/home.store";

interface HomeCheckboxProps {
  label: string;
  id: "poolsoop" | "ilsang" | "grim";
}

function HomeCheckbox({ label, id }: HomeCheckboxProps) {
  const { category, setCategory } = useHomeStore();
  const checked = category.includes(id);

  const handleClick = useCallback(() => {
    if (checked) {
      setCategory(category.filter((c) => c !== id));
    } else {
      setCategory([...category, id]);
    }
  }, [checked, category, id, setCategory]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        "relative flex min-w-12 cursor-pointer flex-col items-center justify-center font-medium text-sm sm:text-xl",
        checked && "text-black"
      )}
      aria-pressed={checked}
      aria-label={`${label} 카테고리 ${checked ? "선택됨" : "선택 안됨"}`}
    >
      <span className="relative z-10">{label}</span>
      {checked ? (
        <div className="relative h-2 w-8 overflow-hidden sm:w-12">
          <svg
            className="relative h-2 w-full"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="선택된 카테고리 표시"
          >
            <path
              d="M0 4C8.33 2 16.67 6 25 4C33.33 2 41.67 6 50 4C58.33 2 66.67 6 75 4C83.33 2 91.67 6 100 4"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-black"
              fill="none"
            />
          </svg>
        </div>
      ) : (
        <div className="relative h-2 w-8 overflow-hidden sm:w-12" />
      )}
    </button>
  );
}

export default HomeCheckbox;
