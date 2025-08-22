"use client";

import Loading from "@/components/ui/loading";
import { useAboutQuery } from "@/features/home/hooks/home.queries";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

function AboutText() {
  const { data: about, isPending, error } = useAboutQuery();
  const router = useRouter();

  useEffect(() => {
    if (error) {
      toast.error("Error getting about:");
      router.push("/");
    }
  }, [error, router]);

  return (
    <div className="flex flex-col gap-4 pb-4">
      {isPending ? (
        <Loading type="partial" />
      ) : (
        <p className="font-bold text-xl">{about?.desc}</p>
      )}
    </div>
  );
}

export default AboutText;
