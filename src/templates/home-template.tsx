"use client";

import RecordModal from "@/components/ui/record-modal";
import { HomeFloating, HomeGrid } from "@/features/home";
import { useContentParam } from "@/hooks/use-content-param";

function HomeTemplate() {
  const { content, isOpen, setContent } = useContentParam();

  const handleClose = () => {
    setContent(null);
  };

  return (
    <section className="flex flex-col">
      <div className="flex flex-col gap-4 pb-4">
        <h1 className="font-bold text-[calc(36/640*100svw)] sm:text-4xl">
          allrecords.me
        </h1>
      </div>
      <HomeGrid />
      <HomeFloating />
      <RecordModal slug={content} isOpen={isOpen} onClose={handleClose} />
    </section>
  );
}

export default HomeTemplate;
