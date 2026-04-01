import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-12 font-sans dark:bg-black">
      <main className="mx-auto w-full max-w-4xl rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">allrecords</h1>
        <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          Historian 노트를 인터랙티브 그래프로 시각화합니다. 이벤트, 토픽, 태그, 인물 간의 관계를 탐색해보세요.
        </p>

        <div className="mt-6">
          <Link
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-white"
            href="/timeline"
          >
            Open Timeline Graph
          </Link>
        </div>
      </main>
    </div>
  );
}
