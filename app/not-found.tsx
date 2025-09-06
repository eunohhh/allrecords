import Image from "next/image";
import Link from "next/link";

function NotFound() {
  return (
    <main className="flex h-svh flex-col items-center justify-center gap-8">
      <h1 className="font-bold text-[calc(72/640*100svw)] sm:text-[calc(90/1920*100svw)]">
        앗 잘못 들어왔어요
      </h1>
      <div className="relative aspect-[360/210] w-[50%] max-w-[360px] sm:w-[90%]">
        <Image
          src="/house.webp"
          alt="404"
          fill
          sizes="(max-width: 640px) 50vw, 90vw"
          priority
        />
      </div>
      <Link
        href="/"
        className="mt-4 font-bold text-[calc(52/640*100svw)] sm:text-[calc(56/1920*100svw)]"
      >
        돌아가기
      </Link>
    </main>
  );
}

export default NotFound;
