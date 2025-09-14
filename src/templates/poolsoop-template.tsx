"use client";

import {
  PoolsoopFooter,
  PoolsoopHeader,
  PoolsoopToon,
} from "@/features/poolsoop";

function PoolsoopTemplate() {
  return (
    <section className="flex h-svh flex-col items-center justify-center bg-green-200">
      <PoolsoopHeader />
      <PoolsoopToon />
      <PoolsoopFooter />
    </section>
  );
}

export default PoolsoopTemplate;
