"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function GraphToolbar(props: {
	limit: number;
	setLimit: (n: number) => void;
	onRefresh: () => void;
	onResetView: () => void;
	showEvents: boolean;
	setShowEvents: (v: boolean) => void;
	showTopics: boolean;
	setShowTopics: (v: boolean) => void;
	showTags: boolean;
	setShowTags: (v: boolean) => void;
	showPeople: boolean;
	setShowPeople: (v: boolean) => void;
	onOpenAdd: () => void;
}) {
	return (
		<div className="mb-2 flex flex-wrap items-center gap-2 sm:mb-3">
			<div className="hidden font-medium text-zinc-700 sm:block sm:text-sm dark:text-zinc-200">
				Historian Graph
			</div>

			<div className="ml-auto flex flex-wrap items-center gap-2 sm:flex-nowrap">
				<Label htmlFor="graph-limit" className="text-xs text-zinc-500">
					limit
				</Label>
				<Input
					id="graph-limit"
					className="w-16 text-xs sm:w-28 sm:text-sm"
					type="number"
					min={10}
					max={1000}
					value={props.limit}
					onChange={(e) => {
						const value = Number(e.target.value);
						if (!Number.isFinite(value)) return;
						props.setLimit(Math.max(10, Math.min(200, value)));
					}}
				/>

				<Button
					variant="outline"
					onClick={props.onRefresh}
					className="text-xs sm:text-sm"
				>
					Refresh
				</Button>
				<Button
					variant="outline"
					onClick={props.onResetView}
					title="Reset zoom/pan"
					className="text-xs sm:text-sm"
				>
					Reset view
				</Button>

				<div className="flex w-full flex-nowrap items-center justify-between rounded-md border border-zinc-200 p-1.5 text-xs text-zinc-600 sm:w-auto sm:gap-3 sm:px-3 sm:py-2 dark:border-zinc-800 dark:text-zinc-300">
					<div className="flex items-center gap-1 sm:gap-2">
						<Checkbox
							id="graph-show-events"
							checked={props.showEvents}
							onCheckedChange={(checked) =>
								props.setShowEvents(checked === true)
							}
						/>
						<Label
							htmlFor="graph-show-events"
							className="cursor-pointer font-normal text-xs"
						>
							events
						</Label>
					</div>
					<div className="flex items-center gap-1 sm:gap-2">
						<Checkbox
							id="graph-show-topics"
							checked={props.showTopics}
							onCheckedChange={(checked) =>
								props.setShowTopics(checked === true)
							}
						/>
						<Label
							htmlFor="graph-show-topics"
							className="cursor-pointer font-normal text-xs"
						>
							topics
						</Label>
					</div>
					<div className="flex items-center gap-1 sm:gap-2">
						<Checkbox
							id="graph-show-tags"
							checked={props.showTags}
							onCheckedChange={(checked) => props.setShowTags(checked === true)}
						/>
						<Label
							htmlFor="graph-show-tags"
							className="cursor-pointer font-normal text-xs"
						>
							tags
						</Label>
					</div>
					<div className="flex items-center gap-1 sm:gap-2">
						<Checkbox
							id="graph-show-people"
							checked={props.showPeople}
							onCheckedChange={(checked) =>
								props.setShowPeople(checked === true)
							}
						/>
						<Label
							htmlFor="graph-show-people"
							className="cursor-pointer font-normal text-xs"
						>
							people
						</Label>
					</div>

					<Button
						size="sm"
						variant="default"
						onClick={props.onOpenAdd}
						className="text-xs sm:text-sm"
					>
						Add event
					</Button>
				</div>
			</div>
		</div>
	);
}
