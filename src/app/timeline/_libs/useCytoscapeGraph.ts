"use client";

import cytoscape, { type Core, type ElementDefinition } from "cytoscape";
import fcose from "cytoscape-fcose";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Graph } from "../_types/types";
import { nodeType } from "./graph-utils";

let registered = false;
function ensureExtensions() {
  if (registered) return;
  cytoscape.use(fcose);
  registered = true;
}

type Params = {
  containerRef: React.RefObject<HTMLDivElement | null>;
  graph: Graph | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onOpenDetails: () => void;
};

type Result = {
  resetView: () => void;
  isReady: boolean;
};

const STYLE: cytoscape.StylesheetCSS[] = [
  {
    selector: "node",
    css: {
      "font-size": 10,
      color: "#1f2937",
      "text-valign": "center",
      "text-halign": "right",
      "text-margin-x": 6,
      "text-wrap": "ellipsis",
      "text-max-width": "140px",
      "min-zoomed-font-size": 9,
      "border-width": 1,
      "border-color": "#0b1220",
      width: 14,
      height: 14,
    },
  },
  {
    selector: "node.show-label",
    css: { label: "data(label)" },
  },
  {
    selector: 'node[type="event"]',
    css: {
      "background-color": "#2563eb",
      width: 8,
      height: 8,
    },
  },
  {
    selector: 'node[type="topic"]',
    css: {
      "background-color": "#10b981",
      color: "#065f46",
      width: 12,
      height: 12,
      "font-weight": 600,
    },
  },
  {
    selector: 'node[type="tag"]',
    css: { "background-color": "#a855f7", width: 8, height: 8 },
  },
  {
    selector: 'node[type="person"]',
    css: { "background-color": "#f97316", width: 8, height: 8 },
  },
  {
    selector: "node:selected",
    css: { "border-width": 3, "border-color": "#f59e0b" },
  },
  { selector: "node.dimmed", css: { opacity: 0.18 } },
  {
    selector: "edge",
    css: {
      width: 1,
      "line-color": "#a1a1aa",
      "curve-style": "straight",
      opacity: 0.35,
    },
  },
  { selector: 'edge[type="THEME"]', css: { "line-color": "#10b981" } },
  { selector: 'edge[type="TAGGED"]', css: { "line-color": "#a855f7" } },
  { selector: 'edge[type="MENTIONS"]', css: { "line-color": "#f97316" } },
  {
    selector: "edge.highlighted",
    css: { width: 2.2, opacity: 0.95 },
  },
  { selector: "edge.dimmed", css: { opacity: 0.08 } },
];

function buildElements(graph: Graph): ElementDefinition[] {
  const ids = new Set(graph.nodes.map((n) => n.id));
  const nodes: ElementDefinition[] = graph.nodes.map((n) => {
    const label = n.title.length > 32 ? `${n.title.slice(0, 32)}…` : n.title;
    return {
      group: "nodes",
      data: { id: n.id, label, title: n.title, type: nodeType(n) },
    };
  });
  const edges: ElementDefinition[] = graph.edges
    .filter((e) => ids.has(e.from) && ids.has(e.to))
    .map((e) => ({
      group: "edges",
      data: {
        id: `${e.from}->${e.to}:${e.type}`,
        source: e.from,
        target: e.to,
        type: e.type,
      },
    }));
  return [...nodes, ...edges];
}

function runLayout(cy: Core, randomize: boolean) {
  cy.layout({
    name: "fcose",
    animate: false,
    randomize,
    quality: "default",
    nodeRepulsion: () => 9000,
    idealEdgeLength: (edge: cytoscape.EdgeSingular) => {
      const t = edge.data("type");
      if (t === "THEME") return 140;
      if (t === "TAGGED" || t === "MENTIONS") return 110;
      return 70;
    },
    nodeSeparation: 100,
    packComponents: true,
    padding: 30,
    fit: true,
  } as cytoscape.LayoutOptions).run();
}

function applyHighlight(cy: Core, selectedId: string | null) {
  cy.batch(() => {
    cy.elements().removeClass("dimmed highlighted show-label");
    if (!selectedId) return;
    const sel = cy.$id(selectedId);
    if (sel.empty()) return;
    const neighborhood = sel.closedNeighborhood();
    const others = cy.elements().difference(neighborhood);
    others.addClass("dimmed");
    neighborhood.edges().addClass("highlighted");
    neighborhood.nodes().addClass("show-label");
  });
}

export function useCytoscapeGraph(params: Params): Result {
  const { containerRef, graph, selectedId, onSelect, onOpenDetails } = params;
  const cyRef = useRef<Core | null>(null);
  const [isReady, setIsReady] = useState(false);

  const onSelectRef = useRef(onSelect);
  const onOpenDetailsRef = useRef(onOpenDetails);
  const selectedIdRef = useRef(selectedId);
  // 재구성 사이에 노드 좌표를 보존한다(필터로 숨겼다 되살린 노드 포함).
  const positionsRef = useRef(new Map<string, cytoscape.Position>());
  useEffect(() => {
    onSelectRef.current = onSelect;
    onOpenDetailsRef.current = onOpenDetails;
  }, [onSelect, onOpenDetails]);
  useEffect(() => {
    selectedIdRef.current = selectedId;
  }, [selectedId]);

  useEffect(() => {
    ensureExtensions();
    const container = containerRef.current;
    if (!container) return;

    const cy = cytoscape({
      container,
      elements: [],
      style: STYLE,
      minZoom: 0.2,
      maxZoom: 4,
    });
    cyRef.current = cy;
    setIsReady(true);

    cy.on("tap", "node", (e) => {
      const id = e.target.id() as string;
      onSelectRef.current(id);
      onOpenDetailsRef.current();
    });

    cy.on("tap", (e) => {
      if (e.target === cy) {
        onSelectRef.current(null);
      }
    });

    cy.on("dbltap", (e) => {
      if (e.target !== cy) return;
      const z = cy.zoom();
      cy.animate(
        {
          zoom: Math.min(z * 1.6, 4),
          center: { eles: cy.collection() },
        },
        { duration: 200 }
      );
    });

    return () => {
      setIsReady(false);
      cyRef.current = null;
      cy.destroy();
    };
  }, [containerRef]);

  // selectedId를 deps에 넣으면 노드 선택만으로 전체 요소 재구성 + 레이아웃
  // 재실행(randomize)이 일어나 노드가 재배치된다. graph 변경에만 반응하고,
  // 재구성 후 선택 상태 복원은 ref로 읽는다.
  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    // 제거 전에 현재 좌표(드래그로 옮긴 위치 포함)를 보존
    cy.nodes().forEach((n) => {
      positionsRef.current.set(n.id(), { ...n.position() });
    });
    cy.batch(() => {
      cy.elements().remove();
      if (graph) cy.add(buildElements(graph));
    });
    if (graph && graph.nodes.length > 0) {
      let newCount = 0;
      cy.batch(() => {
        cy.nodes().forEach((n) => {
          const pos = positionsRef.current.get(n.id());
          if (pos) n.position(pos);
          else newCount += 1;
        });
      });
      if (newCount === cy.nodes().length) {
        // 최초 로드: 전체 무작위 배치
        runLayout(cy, true);
      } else if (newCount > 0) {
        // 새 노드가 섞인 갱신(이벤트 추가·조회 확대): 기존 위치를 시작점으로
        // 증분 배치해 연속성을 유지한다
        runLayout(cy, false);
      }
      // newCount === 0 (필터 토글, 동일 데이터 재조회): 레이아웃 생략, 위치 유지
    }
    const selectedId = selectedIdRef.current;
    applyHighlight(cy, selectedId);
    if (selectedId) {
      const sel = cy.$id(selectedId);
      if (!sel.empty()) sel.select();
    }
  }, [graph]);

  useEffect(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.$(":selected").unselect();
    if (selectedId) {
      const sel = cy.$id(selectedId);
      if (!sel.empty()) sel.select();
    }
    applyHighlight(cy, selectedId);
  }, [selectedId]);

  const resetView = useCallback(() => {
    const cy = cyRef.current;
    if (!cy) return;
    cy.animate(
      { fit: { eles: cy.elements(), padding: 40 } },
      { duration: 250 }
    );
  }, []);

  return { resetView, isReady };
}
