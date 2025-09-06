import Image from "next/image";
import { cn } from "@/lib/utils";

interface LoadingStarProps {
  className?: string;
}

function LoadingStar({ className }: LoadingStarProps) {
  return (
    <div
      className={cn(
        "relative h-20 w-20 animate-spin [animation-duration:2s]",
        className
      )}
    >
      <Image
        src="/loading.webp"
        alt="loading-star"
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
}

export default LoadingStar;
