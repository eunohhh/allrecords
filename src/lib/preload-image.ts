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

function clamp(number: number, min: number, max: number) {
  return Math.min(max, Math.max(min, number));
}

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
