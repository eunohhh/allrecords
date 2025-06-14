import { Loader2 } from "lucide-react";

function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="mr-3 size-5 animate-spin" />
    </div>
  );
}

export default Loading;
