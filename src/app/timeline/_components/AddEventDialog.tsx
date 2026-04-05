"use client";

import { useId, useState } from "react";
import { toast } from "sonner";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { isTopic } from "../_libs/graph-utils";
import type { HistorianEventNode } from "../_types/types";

export type AddEventForm = {
	ingestKey: string;
	created: string;
	title: string;
	theme: string;
	kind: string;
	era: string;
	year: string;
	tags: string;
	people: string;
	source: string;
	sourcePath: string;
	content: string;
	linkFromSelected: boolean;
};

export function AddEventDialog(props: {
	open: boolean;
	onOpenChange: (v: boolean) => void;
	selected: HistorianEventNode | null;
	form: AddEventForm;
	setForm: (next: AddEventForm) => void;
	onSave: (payload: {
		ingestKey: string;
		event: any;
		previousEventId: string | null;
	}) => Promise<void>;
}) {
	const [isSaving, setIsSaving] = useState(false);

	const ingestKeyId = useId();
	const createdId = useId();
	const titleId = useId();
	const themeId = useId();
	const kindId = useId();
	const eraId = useId();
	const yearId = useId();
	const tagsId = useId();
	const peopleId = useId();
	const sourceId = useId();
	const sourcePathId = useId();
	const contentId = useId();

	const f = props.form;
	const set = (patch: Partial<AddEventForm>) =>
		props.setForm({ ...f, ...patch });

	const canSave = Boolean(f.ingestKey && f.created && f.title && f.content);

	return (
		<Dialog open={props.open} onOpenChange={props.onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>Add Historian Event</DialogTitle>
					<DialogDescription>
						Ingest key is required. This writes directly to Neo4j via GraphQL.
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4 grid gap-3">
					<div className="grid gap-1">
						<Label htmlFor="ingest-key">Ingest key</Label>
						<Input
							id={ingestKeyId}
							placeholder="INGEST_KEY"
							value={f.ingestKey}
							onChange={(e) => set({ ingestKey: e.target.value })}
						/>
					</div>

					<div className="grid gap-1">
						<Label htmlFor="new-created">created</Label>
						<Input
							id={createdId}
							placeholder="YYYY-MM-DD"
							value={f.created}
							onChange={(e) => set({ created: e.target.value })}
						/>
					</div>

					<div className="grid gap-1">
						<Label htmlFor="new-title">title</Label>
						<Input
							id={titleId}
							value={f.title}
							onChange={(e) => set({ title: e.target.value })}
						/>
					</div>

					<div className="grid gap-1">
						<Label htmlFor="new-theme">theme</Label>
						<Input
							id={themeId}
							value={f.theme}
							onChange={(e) => set({ theme: e.target.value })}
						/>
					</div>

					<div className="grid gap-1">
						<Label htmlFor="new-kind">kind</Label>
						<Input
							id={kindId}
							value={f.kind}
							onChange={(e) => set({ kind: e.target.value })}
						/>
					</div>

					<div className="grid gap-1">
						<Label htmlFor="new-era">era</Label>
						<Input
							id={eraId}
							value={f.era}
							onChange={(e) => set({ era: e.target.value })}
						/>
					</div>

					<div className="grid gap-1">
						<Label htmlFor="new-year">year</Label>
						<Input
							id={yearId}
							placeholder="e.g. 1999"
							value={f.year}
							onChange={(e) => set({ year: e.target.value })}
						/>
					</div>

					<div className="grid gap-1">
						<Label htmlFor="new-tags">tags</Label>
						<Input
							id={tagsId}
							placeholder="comma separated"
							value={f.tags}
							onChange={(e) => set({ tags: e.target.value })}
						/>
					</div>

					<div className="grid gap-1">
						<Label htmlFor="new-people">people</Label>
						<Input
							id={peopleId}
							placeholder="comma separated"
							value={f.people}
							onChange={(e) => set({ people: e.target.value })}
						/>
					</div>

					<div className="grid gap-1">
						<Label htmlFor="new-source">source</Label>
						<Input
							id={sourceId}
							value={f.source}
							onChange={(e) => set({ source: e.target.value })}
						/>
					</div>

					<div className="grid gap-1">
						<Label htmlFor="new-sourcePath">sourcePath</Label>
						<Input
							id={sourcePathId}
							value={f.sourcePath}
							onChange={(e) => set({ sourcePath: e.target.value })}
						/>
					</div>

					<div className="grid gap-1">
						<Label htmlFor="new-content">content</Label>
						<Textarea
							id={contentId}
							className="h-56"
							value={f.content}
							onChange={(e) => set({ content: e.target.value })}
						/>
					</div>

					<label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-300">
						<input
							type="checkbox"
							checked={f.linkFromSelected}
							onChange={(e) => set({ linkFromSelected: e.target.checked })}
						/>
						Link from selected event as previous (creates NEXT edge)
					</label>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<Button
						disabled={!canSave || isSaving}
						onClick={async () => {
							const previousEventId =
								f.linkFromSelected && props.selected && !isTopic(props.selected)
									? props.selected.id
									: null;

							try {
								setIsSaving(true);
								await props.onSave({
									ingestKey: f.ingestKey,
									event: {
										created: f.created,
										title: f.title,
										theme: f.theme || null,
										kind: f.kind || null,
										era: f.era || null,
										year:
											f.year && f.year.trim().length > 0
												? Number.parseInt(f.year.trim(), 10)
												: null,
										tags: f.tags
											.split(",")
											.map((s) => s.trim())
											.filter(Boolean),
										people: f.people
											.split(",")
											.map((s) => s.trim())
											.filter(Boolean),
										source: f.source || null,
										sourcePath: f.sourcePath || "",
										content: f.content,
									},
									previousEventId,
								});

								toast.success("Historian event added.");
								props.onOpenChange(false);
							} catch (e) {
								toast.error(e instanceof Error ? e.message : "Unknown error");
							} finally {
								setIsSaving(false);
							}
						}}
					>
						{isSaving && (
							<span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900" />
						)}
						{isSaving ? "Saving…" : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
