export type HistorianEventNode = {
	id: string;
	created: string;
	title: string;
	content: string;
	sourcePath: string;
	theme?: string | null;
	source?: string | null;
	kind?: string | null;
	era?: string | null;
	year?: number | null;
	tags?: string[];
	people?: string[];
};

export type GraphEdge = {
	from: string;
	to: string;
	type: string;
};

export type Graph = {
	nodes: HistorianEventNode[];
	edges: GraphEdge[];
};

export type NodeType = "topic" | "tag" | "person" | "event";
