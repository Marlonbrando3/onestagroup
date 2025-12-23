import React from "react";
import Team from "../../data/team.json";
import Image from "next/image";
import Languages from "./languages";
import Phones from "./phones";

type Person = {
  data: any;
};

export default function Person({ data }: Person) {
  const LanguagesData = data.languages.map((i: any) => {
    if (i.includes("PL")) {
      return <Languages key={i} data={i} lang="PL" />;
    }
    if (i.includes("EN")) {
      return <Languages key={i} data={i} lang="EN" />;
    }
    if (i.includes("ES")) {
      return <Languages key={i} data={i} lang="ES" />;
    }
  });

  return (
    <div className="lg:h-[600px] lg:w-[50%] md:min-h-[350px] w-[90vw] flex p-[20px] lg:flex-col flex-row">
      <div className="md:h-[300px] md:w-[300px] relative rounded-[10px] overflow-hidden h-[250px] w-[150px] mb-[10px] md:mb-0">
        <div className="absolute w-[40%] h-[30px] z-10 bottom-10 flex bg-amber-500 rounded-r-[20px]">
          <Phones phone={data.phone} />
        </div>
        <div className="absolute w-full h-[30px] z-10 bottom-0 flex">{LanguagesData}</div>
        <Image
          src={`/${data.photo}`}
          fill
          objectFit="cover"
          objectPosition="top"
          alt={data.name}
          className={`${
            (data.photo === "Marek.png" && "scale-[140%]") ||
            (data.photo === "Przemek.png" && "scale-[100%]") ||
            (data.photo === "Michał.png" && "scale-[100%]")
          } transform origin-top`}
        ></Image>
      </div>
      <div className="ml-[20px] lg:ml-0 lg:w-[100%] md:w-[90%] w-[90%] flex flex-col justify-center mt-[20px] flex-1">
        <div className="flex flex-col leading-[20px] mb-[10px]">
          <p className="text-[20px] font-bold">{data.name}</p>
          <p className="italic underline">{data.title}</p>
        </div>
        <div className="lg:w-full lg:pr-[15px]">{data.desc}</div>
      </div>
      {/* <div className="h-[1px] w-[90%] bg-gray-800 mt-[30px] md:hidden"></div> */}
    </div>
  );
}
