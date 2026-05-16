import GraphClient from "./_components/GraphClient";

export const dynamic = "force-dynamic";

export default function TimelinePage() {
	return (
		<div className="h-svh min-h-svh bg-zinc-50 px-4 py-4 font-sans sm:py-10 dark:bg-black">
			<div className="mx-auto flex h-full w-full max-w-6xl flex-1 flex-col">
				<div className="mb-1 sm:mb-6">
					<h1 className="font-semibold text-2xl text-zinc-900 tracking-tight dark:text-zinc-50">
						Timeline
					</h1>
				</div>

				<GraphClient />
			</div>
		</div>
	);
}
