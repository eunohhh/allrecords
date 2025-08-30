"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

function HomeFloating() {
  return (
    <div className="fixed right-2 bottom-0">
      <Link href="/withcat">
        <Button
          type="button"
          className="h-36 w-36 cursor-pointer bg-transparent p-0 shadow-none hover:bg-transparent"
        >
          <div className="h-full w-full bg-[url('/main-cat.webp')] bg-center bg-contain" />
        </Button>
      </Link>
      <Link href="/about">
        <Button
          type="button"
          className="h-36 w-36 cursor-pointer bg-transparent p-0 shadow-none hover:bg-transparent"
        >
          <div className="h-full w-full bg-[url('/main-me.webp')] bg-center bg-contain" />
        </Button>
      </Link>
    </div>
  );
}

export default HomeFloating;
