"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

function HomeFloating() {
  return (
    <div className="fixed bottom-0 right-2">
      <Link href="/about">
        <Button
          type="button"
          className="p-0 bg-transparent hover:bg-transparent cursor-pointer"
        >
          <div className="w-14 h-14 bg-blue-500 rounded-full hover:bg-blue-800" />
        </Button>
      </Link>
    </div>
  );
}

export default HomeFloating;
