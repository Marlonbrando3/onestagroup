import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Logotype from "./images/logotype.png";
import SearchComponent from "./searchComponent";
import MiniMainViewBlog from "./MiniMainViewBlog";
import Blog from "../data/Blog.json";

export default function HeaderBlog({ temat }) {
  const router = useRouter();

  let img;
  Blog.map((i) => {
    console.log(i.title);
    if (i.title === temat) {
      img = i.link;
    }
  });

  return (
    <>
      <div className="relative w-full lg:h-[500px] h-auto flex justify-between items-start lg:pl-36 bg-cover mt-[90px] px-10 lg:bg-none flex-col text-[14px] lg:text-[18px] mb-[60px]">
        <div className="h-auto mx-auto lg:w-10/12 w-11/12 pt-[50px] font-semibold">
          <Link href="/" className="lg:px-[20px]">
            {" "}
            Strona główna
          </Link>{" "}
          /{" "}
          <Link href="/blog" className="lg:px-[20px]">
            {" "}
            Blog
          </Link>{" "}
          / <span className="text-orange-500 lg:px-[20px]">{temat}</span>
        </div>
        {/* Title  */}
        <div className="flex flex-col lg:w-10/12 w-11/12 h-auto mt-[10px] mx-auto">
          <h1 className="lg:w-2/3 w-full lg:text-4xl lg:text-gray-900 lg: text-normal text-3xl font-bold grow flex items-center leading-14">
            {temat}
          </h1>
          <p className="mt-[5px]">Data artykułu: 13-01-2024</p>
        </div>
        {/* Bottom  */}
        <div className="lg:w-10/12 w-12/12 flex justify-between mx-auto h-auto lg:flex-row flex-col">
          <div className="w-full lg:w-[400px] lg:h-[200px] h-[200px] object-cover overflow-hidden relative border rounded-xl">
            <Image
              src="/nieruchomosci_w_hiszpanii_co_sie_zmienilo.jpeg"
              fill
              alt="logo"
              objectFit="cover"
            />
          </div>
          <div id="claim" className="lg:w-1/2 font-semibold py-[10px] lg:py-0">
            <h2 className="w-full text-center">
              Zatem zdecydowałeś/zdecydowałaś się&nbsp;aby zrobić kolejny ważny krok w drodze do
              zakupu swojej nieruchomości w Hiszpanii. Jeśli szukasz podstawowej wiedzy o
              działaniach i korkach w procesie zakupu - dobrze trafiłeś. Artykuł powstał z myślą o
              takich osobach. Wierzy, że po jego przeczytaniu zrozumienie rynku oraz procesu zakupu
              nieruchomości w Hiszpanii będą dla Ciebie jaśniejsze.
            </h2>
          </div>
        </div>
      </div>
    </>
  );
}
