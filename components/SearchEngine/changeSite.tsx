import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

type Props = {
  propertiesSubSitesLengt: any;
  actualPage: any;
  setActualPage: any;
  temptSubSite: any;
  setTempSubSite: any;
};

export default function ChangeSite({
  propertiesSubSitesLengt,
  actualPage,
  setActualPage,
  temptSubSite,
  setTempSubSite,
}: Props) {
  const router = useRouter();

  const { page } = router.query;

  const sites = [];

  for (let i = 0; i < propertiesSubSitesLengt; i++) {
    sites.push(i);
  }

  // console.log(sites);

  const handleInputChanging = (e: any) => {
    setTempSubSite(e.target.value);
  };

  const handleChanginSite = (e: any) => {
    e.preventDefault();
    console.log(e.target.value);
    router.query.page = temptSubSite;
    router.push(router);
    setActualPage(temptSubSite);
  };

  const handlingNextSite = () => {
    router.query.page = actualPage + 1;
    router.push(router);
    setActualPage(actualPage + 1);
  };

  const handlingBackSite = () => {
    router.query.page = actualPage - 1;
    router.push(router);
    setActualPage(actualPage - 1);
  };

  // const sitesChanerFullLenght = (
  //   <div className="w-[300px] mx-auto flex justify-center">
  //     <p className={`mr-[8px] font-boldz ${propertiesSubSitesLengt === 0 ? "hidden" : "visible"}`}>
  //       Strony{" "}
  //     </p>{" "}
  //     {sites.map((p: any, index: any) => (
  //       <div
  //         key={index}
  //         onClick={() => handleChanginSite(index)}
  //         className={`px-[10px] mx-[2px] rounded-md cursor-pointer ${
  //           parseInt(page as string) === index + 1
  //             ? "bg-none border border-gray-700 font-bold"
  //             : "bg-yellow-500 border border-yellow-500"
  //         }`}
  //       >
  //         {index + 1}
  //       </div>
  //     ))}
  //   </div>
  // );

  console.log(actualPage);
  const sitesChanger: any = (
    <form onSubmit={handleChanginSite} className="flex items-center justify-center">
      <IoIosArrowBack
        className={`${actualPage === 1 && "hidden"} w-[50px] h-[25px] cursor-pointer`}
        onClick={handlingBackSite}
      />
      <input
        className="border border-gray-800 rounded-[3px] bg-transparent w-[40px] h-[40px] text-center font-bold text-[20px] placeholder-gray-900 focus:placeholder-gray-400"
        placeholder={`${actualPage}`}
        onChange={handleInputChanging}
      ></input>
      <div className="pl-[9px] text-[20px] font-bold">z {Math.ceil(propertiesSubSitesLengt)}</div>
      <IoIosArrowForward className="w-[50px] h-[25px] cursor-pointer" onClick={handlingNextSite} />
    </form>
  );

  useEffect(() => {}, [router.isReady, router.query.page]);

  return (
    <div className="w-full h-[50px] flex items-center overflow-x-hidden place-content-center">
      {router.isReady && sitesChanger}
    </div>
  );
}
