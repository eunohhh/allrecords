"use client";

import { AboutText } from "@/features/about";
import H1 from "@/features/home/ui/h1";

function AboutTemplate() {
  return (
    <div className="flex flex-col sm:min-h-[calc(100svh-80px)]">
      <H1 />
      <AboutText />
      {/* <AboutForm /> */}
    </div>
  );
}

export default AboutTemplate;
