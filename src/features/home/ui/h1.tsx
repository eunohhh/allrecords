import Link from "next/link";

function H1() {
  return (
    <div className="flex flex-col pb-4">
      <Link href="/" className="relative w-fit">
        <h1 className="font-medium font-uhbeehyeki text-[calc(44/640*100svw)] sm:text-[calc(50/1920*100svw)]">
          gnyang.homes
        </h1>
      </Link>
    </div>
  );
}

export default H1;
