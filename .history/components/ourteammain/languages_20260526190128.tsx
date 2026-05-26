import React from "react";
import Team from "../../data/team.json";
import Image from "next/image";

type Person = {
  data: any;
  lang: any;
};

export default function Languages({ data, lang }: Person) {
  return (
    <div className="w-[40px] h-[38px] relative mx-[7px] rounded-[6px] overflow-hidden">
      <Image src={`/${lang}.png`} fill objectFit="cover" alt="EN"></Image>;
    </div>
  );
}
