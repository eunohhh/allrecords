"use client";

import { AboutForm, AboutText } from "@/features/about";

function AboutTemplate() {
  return (
    <main className="flex h-svh flex-col px-2">
      <div className="flex flex-col gap-4 pb-4">
        <h1 className="font-bold text-4xl">allrecords.me</h1>
      </div>
      <AboutText />
      <AboutForm />
    </main>
  );
}

export default AboutTemplate;
