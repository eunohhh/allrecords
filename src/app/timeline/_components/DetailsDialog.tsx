"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { labelFor, nodeType } from "../_libs/graph-utils";
import type { Graph, HistorianEventNode } from "../_types/types";

const SECTION_HEADER =
	"text-[11px] font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400";

export function DetailsDialog(props: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	selected: HistorianEventNode | null;
	adjacency: Map<string, Set<string>>;
	graph: Graph | null;
	onSelectNeighbor: (id: string) => void;
}) {
	const node = props.selected;
	const typeLabel = node
		? nodeType(node).replace(/^./, (c) => c.toUpperCase())
		: "";
	const neighborIds = node ? [...(props.adjacency.get(node.id) ?? [])] : [];
	const hasMeta = node
		? Boolean(node.kind || node.era || node.year != null || node.source)
		: false;

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogContent className="flex max-h-[90vh] max-w-none flex-col overflow-hidden rounded-xs sm:max-w-6xl">
				<DialogHeader>
					<DialogTitle>{node ? labelFor(node) : "Details"}</DialogTitle>
					<DialogDescription>
						type:{" "}
						<span className="font-medium text-zinc-700 dark:text-zinc-200">
							{typeLabel}
						</span>
					</DialogDescription>
				</DialogHeader>

				<div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
					{!node && (
						<div className="text-sm text-zinc-500 dark:text-zinc-400">
							Select a node.
						</div>
					)}

					{node && (
						<>
							{(node.theme || hasMeta) && (
								<section className="space-y-1">
									{hasMeta && (
										<dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
											{node.kind && (
												<>
													<dt className="text-zinc-500 dark:text-zinc-400">
														Kind
													</dt>
													<dd className="text-zinc-800 dark:text-zinc-100">
														{node.kind}
													</dd>
												</>
											)}
											{node.era && (
												<>
													<dt className="text-zinc-500 dark:text-zinc-400">
														Era
													</dt>
													<dd className="text-zinc-800 dark:text-zinc-100">
														{node.era}
													</dd>
												</>
											)}
											{node.year != null && (
												<>
													<dt className="text-zinc-500 dark:text-zinc-400">
														Year
													</dt>
													<dd className="text-zinc-800 dark:text-zinc-100">
														{node.year}
													</dd>
												</>
											)}
										</dl>
									)}
								</section>
							)}

							{node.tags && node.tags.length > 0 && (
								<section>
									<h3 className={SECTION_HEADER}>Tags</h3>
									<div className="mt-2 flex flex-wrap gap-1.5">
										{node.tags.slice(0, 16).map((tag) => (
											<span
												key={tag}
												className="rounded-full bg-purple-50 px-2 py-0.5 text-purple-700 text-xs dark:bg-purple-950/60 dark:text-purple-100"
											>
												{tag}
											</span>
										))}
									</div>
								</section>
							)}

							{node.people && node.people.length > 0 && (
								<section>
									<h3 className={SECTION_HEADER}>People</h3>
									<div className="mt-2 flex flex-wrap gap-1.5">
										{node.people.slice(0, 16).map((person) => (
											<span
												key={person}
												className="rounded-full bg-orange-50 px-2 py-0.5 text-orange-700 text-xs dark:bg-orange-950/60 dark:text-orange-100"
											>
												{person}
											</span>
										))}
									</div>
								</section>
							)}

							{nodeType(node) === "event" && node.content && (
								<section>
									<h3 className={SECTION_HEADER}>Content</h3>
									<div className="markdown mt-2 rounded-lg border border-zinc-200 bg-zinc-50/70 p-4 text-[15px] text-zinc-800 leading-7 dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100">
										<ReactMarkdown
											remarkPlugins={[remarkGfm]}
											rehypePlugins={[rehypeHighlight]}
										>
											{node.content}
										</ReactMarkdown>
									</div>
								</section>
							)}

							<section>
								<h3 className={SECTION_HEADER}>Neighbors</h3>
								<div className="mt-2 flex flex-wrap gap-2">
									{neighborIds.length === 0 ? (
										<span className="text-xs text-zinc-500 dark:text-zinc-400">
											No connections
										</span>
									) : (
										neighborIds.map((id) => {
											const neighbor = props.graph?.nodes.find(
												(x) => x.id === id,
											);
											if (!neighbor) return null;
											const neighborType = nodeType(neighbor);
											const cls =
												neighborType === "topic"
													? "border-emerald-200 text-emerald-700 dark:border-emerald-900/50 dark:text-emerald-200"
													: neighborType === "tag"
														? "border-purple-200 text-purple-700 dark:border-purple-900/50 dark:text-purple-200"
														: neighborType === "person"
															? "border-orange-200 text-orange-700 dark:border-orange-900/50 dark:text-orange-200"
															: "border-zinc-200 text-zinc-700 dark:border-zinc-800 dark:text-zinc-200";

											return (
												<button
													type="button"
													key={id}
													onClick={() => props.onSelectNeighbor(id)}
													className={`cursor-pointer rounded-full border px-2.5 py-1 text-xs hover:bg-zinc-50 dark:hover:bg-zinc-800/70 ${cls}`}
												>
													{neighbor.title.length > 36
														? `${neighbor.title.slice(0, 36)}…`
														: neighbor.title}
												</button>
											);
										})
									)}
								</div>
							</section>
						</>
					)}
				</div>

				<DialogFooter className="pt-2">
					<DialogClose asChild>
						<Button variant="outline">Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
