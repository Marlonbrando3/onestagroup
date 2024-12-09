import React from "react";
import Team from "../../data/team.json";
import Image from "next/image";
import Languages from "./languages";

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
    <div className="md:h-[400px] md:w-[50%] w-[90%] flex p-[20px] flex-col md:flex-row">
      <div className="md:h-full md:w-[300px] relative rounded-[10px] overflow-hidden h-[150px] w-[150px] mb-[10px] md:mb-0">
        <div className="absolute w-full h-[30px] z-10 bottom-0 flex">{LanguagesData}</div>
        <Image src={`/${data.photo}`} fill objectFit="cover" alt={data.name}></Image>
      </div>
      <div className="md:pl-[30px] md:w-[350px] flex flex-col justify-center">
        <div className="flex flex-col leading-[20px] mb-[10px]">
          <p className="text-[20px] font-bold">{data.name}</p>
          <p className="italic underline">{data.title}</p>
        </div>
        <div className="w-[300px]">{data.desc}</div>
      </div>
      <div className="h-[1px] w-[90%] bg-gray-800 mt-[30px] md:hidden"></div>
    </div>
  );
}
