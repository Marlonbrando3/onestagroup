import React from "react";

type Property = {
  investition: any;
};

export default function MainDescription({ investition }: Property) {
  const MainDescription = investition[0].description.split("-1-")[0];

  return (
    <p
      className="w-[88%] my-[20px] mx-auto text-[16px]"
      dangerouslySetInnerHTML={{ __html: MainDescription }}
    ></p>
  );
}
