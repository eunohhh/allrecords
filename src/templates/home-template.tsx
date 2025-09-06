"use client";

import { HomeFloating, HomeGrid } from "@/features/home";
import H1 from "@/features/home/ui/h1";
import RecordModal from "@/features/home/ui/record-modal";
import { useContentParam } from "@/hooks/use-content-param";

function HomeTemplate() {
  const { content, isOpen, setContent } = useContentParam();

  const handleClose = () => {
    setContent(null);
  };

  return (
    <section className="flex flex-col">
      <H1 />
      <HomeGrid />
      <HomeFloating />
      <RecordModal slug={content} isOpen={isOpen} onClose={handleClose} />
    </section>
  );
}

export default HomeTemplate;
