import React from "react";

type Property = {
  investition: any;
};

export default function FirstDescription({ investition }: Property) {
  const MainDescription = investition[0].description;

  const startIndex = MainDescription.indexOf("-1-<br>") + 7;
  console.log(startIndex);
  const endIndex = MainDescription.indexOf("-2-");
  const firstescription = MainDescription.substring(startIndex, endIndex);
  console.log(firstescription);

  return (
    <div className="">
      <p className="font-bold text-[26px]">Obiekt</p>
      <p
        className="w-full mx-auto my-[15px] border border-green-500"
        dangerouslySetInnerHTML={{ __html: firstescription }}
      ></p>
    </div>
  );
}
