import {
  ForesightManager,
  type ForesightRegisterOptionsWithoutElement,
  type ForesightRegisterResult,
} from "js.foresight";
import { useEffect, useRef } from "react";

// ForesightJS 전역 설정 초기화 (모듈 로드 시 한 번만 실행)
if (typeof window !== "undefined") {
  ForesightManager.initialize({
    touchDeviceStrategy: "viewport", // 모바일: 뷰포트 진입 시 프리로드
    enableMousePrediction: true, // 데스크톱: 마우스 예측
    enableScrollPrediction: true, // 스크롤 예측
    scrollMargin: 150, // 스크롤 방향 150px 앞 감지
  });
}

export default function useForesight<T extends HTMLElement = HTMLElement>(
  options: ForesightRegisterOptionsWithoutElement
) {
  const elementRef = useRef<T>(null);
  const registerResults = useRef<ForesightRegisterResult | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    registerResults.current = ForesightManager.instance.register({
      element: elementRef.current,
      ...options,
    });
  }, [options]);

  return { elementRef, registerResults };
}
