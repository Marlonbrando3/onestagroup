import React from "react";

type Property = {
  investition: any;
};

export default function SecondDescription({ investition }: Property) {
  const MainDescription = investition[0].description;

  const startIndex = MainDescription.indexOf("-2-<br>") + 7;
  console.log(startIndex);
  const endIndex = MainDescription.indexOf("-3-");
  const secondescription = MainDescription.substring(startIndex, endIndex);

  return (
    <div className="">
      <p className="font-bold text-[26px]">Okolica</p>
      <div
        className="w-full mx-auto my-[15px]"
        dangerouslySetInnerHTML={{ __html: secondescription }}
      ></div>
    </div>
  );
}
