import React from "react";
import Person from "./person";
import { Red_Hat_DisplayFont } from "../../fonts/fonts";
import Team from "../../data/team.json";

export default function Ourteammain() {
  const data = Team.map((i) => <Person key={i.id} data={i} />);

  return (
    <div
      className={`${Red_Hat_DisplayFont.className} lg:w-[1050px] w-[95vw] flex flex-wrap my-[190px] md:flex-col lg:flex-row items-center justify-start mx-auto`}
    >
      <div className="text-[30px] w-[95%] md:w-[90vw] mx-auto md:mx-[22px] font-semibold">
        <p className="text-[25px] mb-[40px] w-screen md:w-auto text-left font-semibold uppercase">
          Nasz
          <span className="bg-orange-500 px-[5px] text-white rounded-sm"> zespół</span>
        </p>
      </div>

      {data}
    </div>
  );
}
