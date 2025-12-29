import Image from "next/image";

const aboutText = [
  `그냥그냥\n\n그냥 적는다\n그냥 그린다\n그냥 만든다\n\n그냥 그렇게 하는 것이 좋아서`,
  `베프, 고양이 두마리와 함께 살고있다\n2024년 여름부터 캣시터로 일하는 중\n주로 바쁜 직장인, 여행가는 보호자들의\n고양이들을 돌본다`,
  `에너지 레벨이 낮고 금새 지치는 탓에\n(3n년이 지나고나서야 받아들였다)\n게을러 보일지도 모를 정도의\n느린 페이스로 지내고 있다\n좀 게으른지도..`,
  `내가 뭘 할 수 있을까라는 고민은\n죽기 전까지 할 것 같지만,\n방치하다시피 놔둔것들을 정리를 하고\n살아야겠다는 생각으로 만들었다\n정리하지 않으니 쌓이기만하고\n너무 많이 쌓이면 내가 한 것도\n기억하지 못하고 더 방치한다`,
];

function AboutText() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center text-[calc(34.5/768*100svw)] md:text-[calc(35/1920*100svw)]">
      <div className="flex w-full flex-col md:flex-row">
        <div className="flex h-full flex-col md:w-[45%]">
          <section className="flex h-full border-b-2 border-dotted pb-8 md:border-r-2 md:border-b-2 md:py-8 md:pr-8">
            <p className="h-full whitespace-pre-line">{aboutText[0]}</p>
          </section>
          <section className="flex h-full flex-col border-b-2 border-dotted py-8 md:gap-3 md:border-r-2 md:border-b-0 md:py-8 md:pr-8">
            <div className="relative aspect-[1043/140] w-[90%] max-w-[440px] md:max-w-none">
              <Image
                src="/about01.webp"
                alt="about01"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <p className="h-full whitespace-pre-line">{aboutText[1]}</p>
          </section>
        </div>
        <div className="flex h-full flex-col md:w-[55%]">
          <section className="flex flex-row-reverse justify-end gap-1 border-b-2 border-dotted py-8 md:flex-row md:justify-start md:gap-10 md:border-b-2 md:py-8 md:pl-8">
            <div className="relative w-[calc(146/768*100svw)] md:w-[calc(190/1920*100svw)]">
              <Image
                src="/about02.webp"
                alt="about02"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="aspect-[540/698] object-contain"
              />
            </div>
            <p className="h-full whitespace-pre-line">{aboutText[2]}</p>
          </section>
          <section className="flex flex-col gap-0 py-8 md:flex-row md:gap-6 md:py-8 md:pl-8">
            <p className="h-full w-full whitespace-pre-line md:w-[63%]">
              {aboutText[3]}
            </p>
            <div className="flex h-[calc(250/768*100svw)] justify-end md:h-[calc(430/1920*100svw)] md:w-[37%] md:items-end md:justify-start">
              <div className="relative aspect-[998/899] w-1/2 md:h-fit md:w-[90%]">
                <Image
                  src="/about03.webp"
                  alt="about03"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default AboutText;
