// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import type { Core } from "cytoscape";
import { beforeAll, describe, expect, it, vi } from "vitest";
import type { Graph } from "../_types/types";
import { useCytoscapeGraph } from "./useCytoscapeGraph";

// 훅 내부의 cy 인스턴스를 관찰하기 위해 default export를 감싸 생성 인스턴스를 수집한다.
const { cyInstances } = vi.hoisted(() => ({
  cyInstances: [] as Core[],
}));

vi.mock("cytoscape", async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  const real = (actual.default ?? actual) as ((...args: unknown[]) => Core) & {
    use: (ext: unknown) => void;
  };
  const wrapped = (...args: unknown[]) => {
    const cy = real(...args);
    cyInstances.push(cy);
    return cy;
  };
  wrapped.use = real.use.bind(real);
  return { ...actual, default: wrapped };
});

// jsdom에는 canvas 2D 컨텍스트가 없어 cytoscape 렌더러가 죽는다.
// 어떤 프로퍼티 접근/호출에도 자기 자신을 돌려주는 chameleon으로 대체한다.
// (fcose 레이아웃 좌표 계산은 canvas와 무관한 모델 연산이라 영향 없음)
function makeChameleonCtx(canvas: HTMLCanvasElement) {
  const chameleon: unknown = new Proxy(() => {}, {
    get(_target, prop) {
      if (prop === Symbol.toPrimitive) return () => 0;
      if (prop === "canvas") return canvas;
      return chameleon;
    },
    apply() {
      return chameleon;
    },
    set() {
      return true;
    },
  });
  return chameleon;
}

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement) {
    return makeChameleonCtx(this);
  } as typeof HTMLCanvasElement.prototype.getContext;

  if (!("ResizeObserver" in globalThis)) {
    class ResizeObserverStub {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    (globalThis as Record<string, unknown>).ResizeObserver = ResizeObserverStub;
  }
});

const graph: Graph = {
  nodes: [
    ...Array.from({ length: 8 }, (_, i) => ({
      id: `e${i}`,
      created: "2026-01-01",
      title: `Event ${i}`,
      content: "",
      sourcePath: "",
    })),
    {
      id: "topic:t1",
      created: "2026-01-01",
      title: "Topic 1",
      content: "",
      sourcePath: "",
    },
  ],
  edges: [
    { from: "e0", to: "e1", type: "NEXT" },
    { from: "e1", to: "e2", type: "NEXT" },
    { from: "e2", to: "e3", type: "NEXT" },
    { from: "e0", to: "topic:t1", type: "THEME" },
    { from: "e4", to: "topic:t1", type: "THEME" },
    { from: "e5", to: "e6", type: "NEXT" },
  ],
};

function snapshotPositions(cy: Core): Record<string, { x: number; y: number }> {
  const out: Record<string, { x: number; y: number }> = {};
  cy.nodes().forEach((n) => {
    const p = n.position();
    out[n.id()] = { x: p.x, y: p.y };
  });
  return out;
}

describe("useCytoscapeGraph", () => {
  it("selectedId만 바뀔 때(노드 클릭→모달 오픈) 노드 위치가 유지된다", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const containerRef = { current: container };

    const { rerender, unmount } = renderHook(
      ({ selectedId }: { selectedId: string | null }) =>
        useCytoscapeGraph({
          containerRef,
          graph,
          selectedId,
          onSelect: () => {},
          onOpenDetails: () => {},
        }),
      { initialProps: { selectedId: null as string | null } }
    );

    const cy = cyInstances.at(-1);
    if (!cy) throw new Error("cytoscape instance not captured");
    expect(cy.nodes().length).toBe(graph.nodes.length);

    const before = snapshotPositions(cy);
    // 레이아웃이 실제로 돌았는지 확인 (전부 (0,0)이면 신호가 무의미)
    const distinct = new Set(Object.values(before).map((p) => `${p.x},${p.y}`));
    expect(distinct.size).toBeGreaterThan(1);

    // GraphClient에서 노드 tap → setSelectedId(id) 와 동일한 리렌더:
    // graph 참조는 그대로, selectedId만 변경
    rerender({ selectedId: "e1" });

    expect(snapshotPositions(cy)).toEqual(before);

    unmount();
  });

  it("graph 참조가 갈려도(재조회·필터) 선택과 하이라이트가 새 요소에 복원된다", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const containerRef = { current: container };

    const { rerender, unmount } = renderHook(
      ({ g, selectedId }: { g: Graph; selectedId: string | null }) =>
        useCytoscapeGraph({
          containerRef,
          graph: g,
          selectedId,
          onSelect: () => {},
          onOpenDetails: () => {},
        }),
      { initialProps: { g: graph, selectedId: "e1" as string | null } }
    );

    const cy = cyInstances.at(-1);
    if (!cy) throw new Error("cytoscape instance not captured");

    // 요소 전체가 제거·재생성되는 rebuild 경로를 태운다
    rerender({
      g: { nodes: [...graph.nodes], edges: [...graph.edges] },
      selectedId: "e1",
    });

    expect(cy.$id("e1").selected()).toBe(true);
    // e1의 이웃이 아닌 노드는 dimmed 처리되어야 한다 (하이라이트 복원 확인)
    expect(cy.$id("e5").hasClass("dimmed")).toBe(true);
    expect(cy.$id("e1").hasClass("show-label")).toBe(true);

    unmount();
  });

  it("타입 필터를 껐다 켜도(부분집합 왕복) 노드 위치가 유지된다", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const containerRef = { current: container };

    const { rerender, unmount } = renderHook(
      ({ g }: { g: Graph }) =>
        useCytoscapeGraph({
          containerRef,
          graph: g,
          selectedId: null,
          onSelect: () => {},
          onOpenDetails: () => {},
        }),
      { initialProps: { g: graph } }
    );

    const cy = cyInstances.at(-1);
    if (!cy) throw new Error("cytoscape instance not captured");
    const before = snapshotPositions(cy);

    // GraphClient의 showTopics=false 필터와 동일: topic 노드/간선 제외
    const withoutTopic: Graph = {
      nodes: graph.nodes.filter((n) => n.id !== "topic:t1"),
      edges: graph.edges.filter(
        (e) => e.from !== "topic:t1" && e.to !== "topic:t1"
      ),
    };
    rerender({ g: withoutTopic });

    const during = snapshotPositions(cy);
    expect(Object.keys(during)).not.toContain("topic:t1");
    for (const [id, pos] of Object.entries(during)) {
      expect(pos).toEqual(before[id]);
    }

    // 필터 재활성화: 숨겼던 topic 노드까지 원래 자리로 복귀해야 한다
    rerender({ g: { nodes: [...graph.nodes], edges: [...graph.edges] } });
    expect(snapshotPositions(cy)).toEqual(before);

    unmount();
  });

  it("새 노드가 추가되면 레이아웃이 돌아 새 노드에 위치가 부여된다", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const containerRef = { current: container };

    const { rerender, unmount } = renderHook(
      ({ g }: { g: Graph }) =>
        useCytoscapeGraph({
          containerRef,
          graph: g,
          selectedId: null,
          onSelect: () => {},
          onOpenDetails: () => {},
        }),
      { initialProps: { g: graph } }
    );

    const cy = cyInstances.at(-1);
    if (!cy) throw new Error("cytoscape instance not captured");

    const added: Graph = {
      nodes: [
        ...graph.nodes,
        {
          id: "e-new",
          created: "2026-01-02",
          title: "New Event",
          content: "",
          sourcePath: "",
        },
      ],
      edges: [...graph.edges, { from: "e0", to: "e-new", type: "NEXT" }],
    };
    rerender({ g: added });

    const after = snapshotPositions(cy);
    expect(after["e-new"]).toBeDefined();
    // 증분 레이아웃이 실제로 돌았는지: 전 노드가 서로 다른 위치를 가진다
    const distinct = new Set(Object.values(after).map((p) => `${p.x},${p.y}`));
    expect(distinct.size).toBe(added.nodes.length);

    unmount();
  });
});
