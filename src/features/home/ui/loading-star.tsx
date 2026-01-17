import Image from "next/image";
import { IMAGE_SIZES } from "@/constants/allrecords.consts";
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
      <Image src="/loading.webp" alt="loading-star" fill sizes={IMAGE_SIZES} />
    </div>
  );
}

export default LoadingStar;
