"use client";

import { usePathname } from "next/navigation";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

function MainWrapper({ children }: PropsWithChildren) {
  const pathname = usePathname();
  return (
    <main
      className={cn("flex flex-col p-3 sm:p-10", {
        "p-0 sm:p-0": pathname === "/poolsoop",
      })}
    >
      {children}
    </main>
  );
}

export default MainWrapper;
