import React from "react";
import { useRouter } from "next/router";

type Props = {
  propertiesSubSitesLengt: any;
  actualPage: any;
  setActualPage: any;
};

export default function ChangeSite({ propertiesSubSitesLengt, actualPage, setActualPage }: Props) {
  const router = useRouter();

  const { page } = router.query;

  const sites = [];

  for (let i = 0; i < propertiesSubSitesLengt; i++) {
    sites.push(i);
  }

  // console.log(sites);

  const handleChanginSite = (index: any) => {
    router.query.page = index + 1;
    router.push(router);
    setActualPage(index + 1);
  };

  return (
    <div className="w-full h-[50px] flex items-center overflow-x-hidden">
      <div className="w-[300px] mx-auto flex justify-center">
        <p
          className={`mr-[8px] font-boldz ${propertiesSubSitesLengt === 0 ? "hidden" : "visible"}`}
        >
          Strony{" "}
        </p>{" "}
        {sites.map((p: any, index: any) => (
          <div
            key={index}
            onClick={() => handleChanginSite(index)}
            className={`px-[10px] mx-[2px] rounded-md cursor-pointer ${
              parseInt(page as string) === index + 1
                ? "bg-none border border-gray-700 font-bold"
                : "bg-yellow-500 border border-yellow-500"
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
