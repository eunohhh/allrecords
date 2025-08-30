"use client";

import H1 from "@/components/ui/h1";
import { AboutText } from "@/features/about";

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
