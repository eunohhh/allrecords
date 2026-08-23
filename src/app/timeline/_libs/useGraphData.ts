import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Graph } from "../_types/types";

// 백엔드 /graphql 을 직접 부르지 않고 같은 오리진의 서버 라우트를 경유한다.
// 읽기에도 인증이 걸려 있고, 그 키는 브라우저로 내려보낼 수 없기 때문.
// 프록시: src/app/api/graph/route.ts
export function useGraphData(limit: number) {
  const [graph, setGraph] = useState<Graph | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const firstLoadRef = useRef(true);

  const fetchGraph = useCallback(async () => {
    setError(null);
    setIsLoading(true);
    try {
      const res = await fetch(`/api/graph?limit=${limit}`, {
        cache: "no-store",
      });

      const json = (await res.json()) as any;
      if (!res.ok) {
        throw new Error(json?.error ?? `Failed to load graph (${res.status})`);
      }
      setGraph(json as Graph);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load graph");
      setGraph(null);
    } finally {
      setIsLoading(false);
      firstLoadRef.current = false;
    }
  }, [limit]);

  useEffect(() => {
    void fetchGraph();
  }, [fetchGraph]);

  const isInitialLoading = useMemo(
    () => isLoading && firstLoadRef.current,
    [isLoading]
  );

  return { graph, error, isLoading, isInitialLoading, fetchGraph };
}
