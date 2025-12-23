import React from "react";

type Property = {
  investition: any;
};

export default function ThirthDescription({ investition }: Property) {
  const MainDescription = investition[0].description;

  const startIndex = MainDescription.indexOf("-3-<br>") + 7;
  console.log(startIndex);
  const endIndex = MainDescription.indexOf("-3-");
  const thirdscription = MainDescription.substring(startIndex);

  return (
    <div className="">
      <p className="font-bold text-[26px]">Wyposażenie apartamentów</p>
      <div
        className="w-full mx-auto my-[15px] h-auto border-2"
        dangerouslySetInnerHTML={{ __html: thirdscription }}
      ></div>
    </div>
  );
}
