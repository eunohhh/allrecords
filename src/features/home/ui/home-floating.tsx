"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

function HomeFloating() {
  return (
    <div className="fixed right-2 bottom-1 flex flex-row items-center">
      <Link
        href="/withcat"
        className="relative aspect-[173/135] h-24 w-22 sm:h-36 sm:w-32"
      >
        <Button
          type="button"
          className="flex aspect-[173/135] h-full w-full cursor-pointer items-end bg-transparent p-0 shadow-none hover:bg-transparent"
        >
          <div className="relative bottom-1 aspect-[173/135] w-full bg-[url('/main-cat-2.webp')] bg-center bg-contain bg-no-repeat" />
        </Button>
      </Link>
      <Link href="/about" className="relative h-full w-full">
        <Button
          type="button"
          className="h-24 w-24 cursor-pointer bg-transparent p-0 shadow-none hover:bg-transparent sm:h-36 sm:w-36"
        >
          <div className="h-full w-full bg-[url('/main-me.webp')] bg-center bg-contain bg-no-repeat" />
        </Button>
      </Link>
    </div>
  );
}

export default HomeFloating;
