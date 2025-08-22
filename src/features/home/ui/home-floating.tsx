"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

function HomeFloating() {
  return (
    <div className="fixed right-2 bottom-0">
      <Link href="/about">
        <Button
          type="button"
          className="cursor-pointer bg-transparent p-0 hover:bg-transparent"
        >
          <div className="h-14 w-14 rounded-full bg-blue-500 hover:bg-blue-800" />
        </Button>
      </Link>
    </div>
  );
}

export default HomeFloating;
