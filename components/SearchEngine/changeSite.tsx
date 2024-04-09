import React from "react";
import { useRouter } from "next/router";

type Props = {
  PropertiesDataSubSites: any;
  actualPage: any;
  setActualPage: any;
};

export default function ChangeSite({ PropertiesDataSubSites, actualPage, setActualPage }: Props) {
  const router = useRouter();

  const { page } = router.query;

  const handleChanginSite = (index: any) => {
    router.query.page = index + 1;
    router.push(router);
    setActualPage(index + 1);
  };

  const data = PropertiesDataSubSites.map((p: any, index: any) => (
    <div
      onClick={() => handleChanginSite(index)}
      className={`px-[10px] mx-[2px] rounded-md cursor-pointer ${
        actualPage === index + 1
          ? "bg-none border border-gray-700 font-bold"
          : "bg-yellow-500 border border-yellow-500"
      }`}
    >
      {index + 1}
    </div>
  ));

  return (
    <div className="w-full h-[50px] flex items-center ">
      <div className="w-[300px] mx-auto flex justify-center">
        <p
          className={`mr-[8px] font-boldz ${
            PropertiesDataSubSites.length === 0 ? "hidden" : "visible"
          }`}
        >
          Strony{" "}
        </p>{" "}
        {PropertiesDataSubSites.map((p: any, index: any) => (
          <div
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
