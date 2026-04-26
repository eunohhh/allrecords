export default function Home() {
	return (
		<div className="min-h-screen bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
			<main className="mx-auto w-full max-w-3xl space-y-8">
				<section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
					<h1 className="font-semibold text-3xl text-zinc-900 tracking-tight dark:text-zinc-50">
						AllRecords
					</h1>
					<p className="mt-2 font-medium text-sm text-zinc-700 dark:text-zinc-300">
						A personal records app for iPhone.
					</p>
					<p className="mt-4 text-sm text-zinc-600 leading-6 dark:text-zinc-400">
						AllRecords helps you keep personal records and sync your schedule
						with Google Calendar — all from your iPhone.
					</p>
				</section>

				<section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
					<h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">
						What AllRecords does
					</h2>
					<ul className="mt-4 space-y-2 text-sm text-zinc-600 leading-6 dark:text-zinc-400">
						<li>• Capture personal notes and records on iOS.</li>
						<li>• Connect your Google Calendar to keep schedules in sync.</li>
						<li>
							• View, create, update, and delete events you own — directly from
							the app.
						</li>
					</ul>
				</section>

				<section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
					<h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">
						Why we request Google Calendar access
					</h2>
					<p className="mt-4 text-sm text-zinc-600 leading-6 dark:text-zinc-400">
						AllRecords requests the{" "}
						<code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-xs text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
							https://www.googleapis.com/auth/calendar.events.owned
						</code>{" "}
						scope. This access is used only to let users:
					</p>
					<ul className="mt-4 space-y-2 text-sm text-zinc-600 leading-6 dark:text-zinc-400">
						<li>• View calendar events they own</li>
						<li>• Create new events from the app</li>
						<li>• Update existing events</li>
						<li>• Delete events that are no longer needed</li>
					</ul>
					<p className="mt-4 text-sm text-zinc-600 leading-6 dark:text-zinc-400">
						Google user data is requested only to power these in-app calendar
						features. We do not use it for advertising, user profiling, or
						third-party sale. Full details are in our{" "}
						<a
							href="/privacy-policy"
							className="text-zinc-900 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
						>
							Privacy Policy
						</a>
						.
					</p>
				</section>

				<section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
					<h2 className="font-semibold text-lg text-zinc-900 dark:text-zinc-50">
						Privacy &amp; support
					</h2>
					<ul className="mt-4 space-y-2 text-sm text-zinc-600 leading-6 dark:text-zinc-400">
						<li>
							<a
								href="/privacy-policy"
								className="text-zinc-900 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
							>
								Privacy Policy
							</a>
						</li>
						<li>
							<a
								href="/support"
								className="text-zinc-900 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
							>
								Support
							</a>{" "}
							—{" "}
							<a
								href="mailto:bdohhhhh@gmail.com"
								className="text-zinc-900 underline underline-offset-2 hover:text-zinc-700 dark:text-zinc-100 dark:hover:text-zinc-300"
							>
								bdohhhhh@gmail.com
							</a>
						</li>
					</ul>
				</section>
			</main>
		</div>
	);
}
