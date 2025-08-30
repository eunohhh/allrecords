"use client";

import H1 from "@/components/ui/h1";
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
      <H1 />
      <HomeGrid />
      <HomeFloating />
      <RecordModal slug={content} isOpen={isOpen} onClose={handleClose} />
    </section>
  );
}

export default HomeTemplate;
