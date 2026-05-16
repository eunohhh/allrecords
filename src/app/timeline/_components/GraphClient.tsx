"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { nodeType } from "../_libs/graph-utils";
import { useCytoscapeGraph } from "../_libs/useCytoscapeGraph";
import { useGraphData } from "../_libs/useGraphData";
import type { Graph } from "../_types/types";
import { AddEventDialog, type AddEventForm } from "./AddEventDialog";
import { DetailsDialog } from "./DetailsDialog";
import { GraphToolbar } from "./GraphToolbar";
import { LoadingOverlay } from "./LoadingOverlay";

export default function GraphClient() {
	const [selectedId, setSelectedId] = useState<string | null>(null);
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [addOpen, setAddOpen] = useState(false);

	const [limit, setLimit] = useState(500);

	const [showEvents, setShowEvents] = useState(true);
	const [showTopics, setShowTopics] = useState(true);
	const [showTags, setShowTags] = useState(true);
	const [showPeople, setShowPeople] = useState(true);

	const [form, setForm] = useState<AddEventForm>({
		ingestKey: "",
		created: "",
		title: "",
		theme: "",
		kind: "concept",
		era: "",
		year: "",
		tags: "",
		people: "",
		source: "Historian by OpenClaw",
		sourcePath: "",
		content: "",
		linkFromSelected: true,
	});

	const containerRef = useRef<HTMLDivElement | null>(null);

	const { graph, error, isInitialLoading, fetchGraph } = useGraphData(limit);

	const filteredGraph: Graph | null = useMemo(() => {
		if (!graph) return null;

		const allowedTypes = new Set<string>();
		if (showEvents) allowedTypes.add("event");
		if (showTopics) allowedTypes.add("topic");
		if (showTags) allowedTypes.add("tag");
		if (showPeople) allowedTypes.add("person");

		const nodes = graph.nodes.filter((n) => allowedTypes.has(nodeType(n)));
		const allowedIds = new Set(nodes.map((n) => n.id));
		const edges = graph.edges.filter(
			(e) => allowedIds.has(e.from) && allowedIds.has(e.to),
		);

		return { nodes, edges };
	}, [graph, showEvents, showPeople, showTags, showTopics]);

	const { resetView } = useCytoscapeGraph({
		containerRef,
		graph: filteredGraph,
		selectedId,
		onSelect: setSelectedId,
		onOpenDetails: () => setDetailsOpen(true),
	});

	useEffect(() => {
		if (error) {
			toast.error(error);
		}
	}, [error]);

	useEffect(() => {
		if (!selectedId || !filteredGraph) return;
		if (!filteredGraph.nodes.some((n) => n.id === selectedId)) {
			setSelectedId(null);
			setDetailsOpen(false);
		}
	}, [filteredGraph, selectedId]);

	const adjacency = useMemo(() => {
		const map = new Map<string, Set<string>>();
		if (!filteredGraph) return map;
		for (const e of filteredGraph.edges) {
			if (!map.has(e.from)) map.set(e.from, new Set());
			if (!map.has(e.to)) map.set(e.to, new Set());
			map.get(e.from)?.add(e.to);
			map.get(e.to)?.add(e.from);
		}
		return map;
	}, [filteredGraph]);

	const selected = useMemo(() => {
		if (!filteredGraph || !selectedId) return null;
		return filteredGraph.nodes.find((n) => n.id === selectedId) ?? null;
	}, [filteredGraph, selectedId]);

	const ingest = async (payload: {
		ingestKey: string;
		event: any;
		previousEventId: string | null;
	}) => {
		const res = await fetch("/api/ingest", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Ingest-Key": payload.ingestKey,
			},
			body: JSON.stringify({
				event: payload.event,
				previousEventId: payload.previousEventId,
			}),
		});
		const json = (await res.json()) as any;
		if (!res.ok) {
			throw new Error(json?.error ?? `Ingest failed (${res.status})`);
		}
		await fetchGraph();
	};

	return (
		<div className="relative">
			<GraphToolbar
				limit={limit}
				setLimit={setLimit}
				onRefresh={fetchGraph}
				onResetView={resetView}
				showEvents={showEvents}
				setShowEvents={setShowEvents}
				showTopics={showTopics}
				setShowTopics={setShowTopics}
				showTags={showTags}
				setShowTags={setShowTags}
				showPeople={showPeople}
				setShowPeople={setShowPeople}
				onOpenAdd={() => setAddOpen(true)}
			/>

			<div className="relative rounded-xl border border-zinc-200 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
				{isInitialLoading && <LoadingOverlay label="Loading graph…" />}

				<div ref={containerRef} className="h-[560px] w-full" />

				<div className="mt-3 text-xs text-zinc-500">
					Wheel/pinch to zoom. Double click/tap to zoom in. Drag nodes to
					adjust.
				</div>
			</div>

			<AddEventDialog
				open={addOpen}
				onOpenChange={setAddOpen}
				selected={selected}
				form={form}
				setForm={setForm}
				onSave={async (payload) => {
					await ingest(payload);
				}}
			/>

			<DetailsDialog
				open={detailsOpen}
				onOpenChange={setDetailsOpen}
				selected={selected}
				adjacency={adjacency}
				graph={filteredGraph}
				onSelectNeighbor={(id) => {
					setSelectedId(id);
					setDetailsOpen(true);
				}}
			/>
		</div>
	);
}
