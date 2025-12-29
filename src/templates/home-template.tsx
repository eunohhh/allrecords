"use client";

import { HomeFloating, HomeGrid } from "@/features/home";
import H1 from "@/features/home/ui/h1";

function HomeTemplate() {
  return (
    <section className="flex flex-col">
      <H1 />
      <HomeGrid />
      <HomeFloating />
    </section>
  );
}

export default HomeTemplate;
