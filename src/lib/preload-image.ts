import {
  NEXT_IMAGE_DEVICE_SIZES,
  PRELOAD_DEFAULT_QUALITY,
} from "@/constants/allrecords.consts";

type PreloadParamsOptions = {
  /**
   * CSS 픽셀 기준 뷰포트 폭 (window.innerWidth)
   */
  viewportWidth: number;
  /**
   * 디바이스 픽셀 비율 (window.devicePixelRatio)
   */
  dpr?: number;
  /**
   * 기본 1.0. 모달처럼 거의 풀폭인 경우 1.0, 썸네일/그리드처럼 작으면 더 낮춰도 됨.
   */
  scale?: number;
  /**
   * next/image 품질(0-100). next.config.ts images.qualities 에 포함되어야 함.
   */
  quality?: number;
};

type PreloadImagesOptions = {
  sizes?: string;
  scale?: number;
  quality?: number;
  viewportWidth?: number;
  dpr?: number;
};

function clamp(number: number, min: number, max: number) {
  return Math.min(max, Math.max(min, number));
}

function splitSizes(sizes: string) {
  return sizes
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}

function matchesMediaCondition(media: string, viewportWidth: number) {
  const normalized = media.trim().replace(/^\(/, "").replace(/\)$/, "");
  const match = normalized.match(/^(max|min)-width\s*:\s*(\d+)px$/);
  if (!match) return false;

  const [, type, value] = match;
  const width = Number(value);
  if (Number.isNaN(width)) return false;

  return type === "max" ? viewportWidth <= width : viewportWidth >= width;
}

function parseSizeToScale(size: string, viewportWidth: number) {
  const trimmed = size.trim();
  if (trimmed.endsWith("vw")) {
    const value = Number(trimmed.replace("vw", ""));
    if (Number.isNaN(value)) return null;
    return value / 100;
  }
  if (trimmed.endsWith("px")) {
    const value = Number(trimmed.replace("px", ""));
    if (Number.isNaN(value)) return null;
    return value / viewportWidth;
  }
  if (trimmed === "100%") return 1;

  return null;
}

export function getScaleFromSizes(
  sizes: string | undefined,
  viewportWidth: number
) {
  if (!sizes) return 1;
  const safeViewportWidth = Math.max(1, viewportWidth);

  for (const part of splitSizes(sizes)) {
    const match = part.match(/^\(([^)]+)\)\s+(.+)$/);
    if (match) {
      const [, media, size] = match;
      if (!matchesMediaCondition(`(${media})`, safeViewportWidth)) continue;
      const scale = parseSizeToScale(size, safeViewportWidth);
      if (scale !== null) return clamp(scale, 0.05, 1);
      continue;
    }

    const scale = parseSizeToScale(part, safeViewportWidth);
    if (scale !== null) return clamp(scale, 0.05, 1);
  }

  return 1;
}

/**
 * 정렬된 후보 배열에서 targetWidth보다 크거나 같은 가장 작은 값을 반환합니다.
 *
 * @param targetWidth - 필요한 최소 너비 (viewportWidth × DPR × scale)
 * @param candidates - 오름차순으로 정렬된 후보 너비 배열 (예: NEXT_IMAGE_DEVICE_SIZES)
 * @returns targetWidth 이상인 가장 작은 후보 값. 모든 후보보다 크면 마지막(가장 큰) 후보 반환.
 *
 * @example
 * // targetWidth가 1179일 때
 * pickClosestGreaterOrEqual(1179, [640, 750, 828, 1080, 1200, 1920, 2048, 3840])
 * // => 1200 (1179보다 크거나 같은 가장 작은 값)
 *
 * @example
 * // targetWidth가 5000일 때 (모든 후보보다 큼)
 * pickClosestGreaterOrEqual(5000, [640, 750, 828, 1080, 1200, 1920, 2048, 3840])
 * // => 3840 (가장 큰 후보 반환)
 */
function pickClosestGreaterOrEqual(
  targetWidth: number,
  candidates: readonly number[]
) {
  for (const w of candidates) {
    if (w >= targetWidth) return w;
  }
  return candidates[candidates.length - 1] ?? targetWidth;
}

/**
 * window.innerWidth * DPR 기반으로 next/image가 고를 법한 폭 후보를 선택합니다.
 * - DPR은 과도한 프리로드를 막기 위해 1~3 범위로 클램프합니다.
 * - candidates는 Next 기본 deviceSizes에 맞춰둡니다.
 */
export function getPreloadImageParams({
  viewportWidth,
  dpr = 1,
  scale = 1,
  quality = PRELOAD_DEFAULT_QUALITY,
}: PreloadParamsOptions) {
  const safeViewportWidth = Math.max(1, viewportWidth);
  const safeDpr = clamp(dpr, 1, 3);
  const targetWidth = Math.ceil(safeViewportWidth * safeDpr * scale);
  const width = pickClosestGreaterOrEqual(targetWidth, NEXT_IMAGE_DEVICE_SIZES);
  return { width, quality };
}

/**
 * Next.js Image Optimization API URL을 생성합니다.
 * @param src - 원본 이미지 URL
 * @param width - 이미지 너비 (px)
 * @param quality - 이미지 품질 (0-100)
 * @returns Next.js Image Optimization API URL
 * @example
 * buildImageUrl("https://example.com/image.jpg", 750, 50)
 * => "https://yourdomain.com/_next/image?url=https%3A%2F%2Fexample.com%2Fimage.jpg&w=750&q=50"
 */
export function buildImageUrl(src: string, width: number, quality: number) {
  const encodedUrl = encodeURIComponent(src);
  // 클라이언트 사이드에서는 현재 origin을 사용하여 정확한 도메인을 가져옵니다
  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
        : "http://localhost:3000";
  const url = `${baseUrl}/_next/image?url=${encodedUrl}&w=${width}&q=${quality}`;
  return url;
}

export function imagePromise(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => reject();
  });
}

/**
 * 이미지 프리로드를 수행하고 성공한 이미지 개수를 반환합니다.
 * @param srcs - 프리로드할 이미지 URL 배열
 */
export async function preloadImages(
  srcs: string[],
  options: PreloadImagesOptions = {}
): Promise<number> {
  if (srcs.length === 0) return 0;

  const viewportWidth =
    options.viewportWidth ??
    (typeof window !== "undefined" ? window.innerWidth : 1200);
  const dpr =
    options.dpr ??
    (typeof window !== "undefined" ? window.devicePixelRatio : 1);

  const scale =
    options.scale ?? getScaleFromSizes(options.sizes, viewportWidth);
  const { width, quality } = getPreloadImageParams({
    viewportWidth,
    dpr,
    scale,
    quality: options.quality,
  });

  const promises = srcs.map((src) => {
    const url = buildImageUrl(src, width, quality);
    return imagePromise(url);
  });

  const results = await Promise.allSettled(promises);
  return results.filter((r) => r.status === "fulfilled").length;
}
