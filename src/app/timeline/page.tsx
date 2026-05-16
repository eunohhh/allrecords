import GraphClient from "./_components/GraphClient";

export const dynamic = "force-dynamic";

export default function TimelinePage() {
	return (
		<div className="min-h-screen bg-zinc-50 px-4 py-10 font-sans dark:bg-black">
			<div className="mx-auto w-full max-w-6xl">
				<div className="mb-6">
					<h1 className="font-semibold text-2xl text-zinc-900 tracking-tight dark:text-zinc-50">
						Timeline
					</h1>
				</div>

				<GraphClient />
			</div>
		</div>
	);
}
