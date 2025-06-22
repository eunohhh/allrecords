import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingProps {
  type: "full" | "partial";
}

function Loading({ type = "full" }: LoadingProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        type === "full" ? "h-screen" : "h-full"
      )}
    >
      <Loader2 className="mr-3 size-5 animate-spin" />
    </div>
  );
}

export default Loading;
