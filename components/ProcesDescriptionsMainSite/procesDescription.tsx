import React from "react";
import processDesc from "../../data/processDesc.json";

type data = { data: any };

export default function ProcesDescription({ data }: data) {
  const content = processDesc.filter((i) => data === i.name);

  return (
    <div className="hidden md:block  text-[18px] h-[230px] font-[500] mt-[40px] pr-[80px] duration-200">
      {content[0].description}
    </div>
  );
}
