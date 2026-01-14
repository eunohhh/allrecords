import { env } from "@/env/t3-env";

/**
 * Next.js Image Optimization API URL을 생성합니다.
 * @param src - 원본 이미지 URL
 * @param width - 이미지 너비 (px)
 * @param quality - 이미지 품질 (0-100)
 * @returns Next.js Image Optimization API URL
 * @example
 * buildImageUrl("https://example.com/image.jpg", 750, 50)
 * // => "https://yourdomain.com/_next/image?url=https%3A%2F%2Fexample.com%2Fimage.jpg&w=750&q=50"
 */
export function buildImageUrl(src: string, width: number, quality: number) {
  const encodedUrl = encodeURIComponent(src);
  const url = `${env.NEXT_PUBLIC_URL}/_next/image?url=${encodedUrl}&w=${width}&q=${quality}`;
  return url;
}
