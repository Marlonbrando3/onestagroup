import React from "react";
import Person from "./person";
import { Red_Hat_DisplayFont } from "../../fonts/fonts";
import Team from "../../data/team.json";

export default function Ourteammain() {
  const data = Team.map((i) => <Person key={i.id} data={i} />);

  return (
    <div
      className={`${Red_Hat_DisplayFont.className} w-[85vw] max-w-[1800px] mx-auto my-[90px]`}
    >
      <div className="w-full mb-9">
        <p className="text-center text-[38px] md:text-[30px] font-[500] tracking-[0.4px]">
          Jesteśmy do Twojej dyspozycji
        </p>
      </div>

      <div className="flex flex-wrap items-stretch -mx-3">{data}</div>
    </div>
  );
}
