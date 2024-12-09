import React from "react";
import Person from "./person";
import Team from "../../data/team.json";

export default function Ourteammain() {
  const data = Team.map((i) => <Person data={i} />);

  return (
    <div className="md:w-[1100px] flex flex-wrap md:my-[60px] md:flex-col lg:flex-row items-center">
      <p className="text-[30px] w-[90%] md:w-full  mx-auto md:mx-[22px] font-bold">Nasz zespół</p>
      <div className="w-full "></div>
      {data}
    </div>
  );
}
