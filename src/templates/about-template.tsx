"use client";

import { AboutForm, AboutText } from "@/features/about";

function AboutTemplate() {
  return (
    <main className="flex flex-col h-svh px-2">
      <div className="flex flex-col gap-4 pb-4">
        <h1 className="text-4xl font-bold">allrecords.me</h1>
      </div>
      <AboutText />
      <AboutForm />
    </main>
  );
}

export default AboutTemplate;
