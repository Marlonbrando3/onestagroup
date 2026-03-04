import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

type Props = {
  actualPage: any;
  setActualPage: any;
  temptSubSite: any;
  setTempSubSite: any;
  count: any;
};

export default function ChangeSite({
  actualPage,
  setActualPage,
  temptSubSite,
  setTempSubSite,
  count,
}: Props) {
  const router = useRouter();

  const { page } = router.query;
  const pages = Math.ceil(count / 18);

  const sites = [count / 18];

  for (let i = 0; i < count; i++) {
    sites.push(i);
  }

  const handleInputChanging = (e: any) => {
    // setTempSubSite(e.target.value);
    setActualPage(e.target.value);

    let newPage = Number(e.target.value);

    if (newPage > pages) {
      newPage = pages;
    }
    router
      .push(
        {
          pathname: router.pathname,
          query: {
            ...router.query,
            page: newPage,
          },
        },
        undefined,
        { scroll: false },
      )
      .then(() => {
        window.scrollTo({ top: 350, behavior: "smooth" });
      });
  };

  const handleChanginSite = (e: any) => {
    // e.preventDefault();
    // setActualPage(e.target.value);

    const page = parseInt(router.query.page as string) - 1;

    router.query.page = temptSubSite;
    router
      .push(
        {
          pathname: router.pathname,
          query: router.query,
        },
        undefined,
        { scroll: false, shallow: false },
      )
      .then(() => {
        window.scrollTo({ top: 350, behavior: "smooth" });
      });
  };

  const handlingNextSite = () => {
    const page = parseInt(router.query.page as string) + 1 || 2;
    router.query.page = page.toString();
    router
      .push(
        {
          pathname: router.pathname,
          query: router.query,
        },
        undefined,
        { scroll: false, shallow: false },
      )
      .then(() => {
        window.scrollTo({ top: 350, behavior: "smooth" });
      });
  };

  const handlingBackSite = () => {
    const page = parseInt(router.query.page as string) - 1;
    router.query.page = page.toString();
    router
      .push(
        {
          pathname: router.pathname,
          query: router.query,
        },
        undefined,
        { scroll: false, shallow: false },
      )
      .then(() => {
        window.scrollTo({ top: 350, behavior: "smooth" });
      });
  };

  const sitesChanger: any = (
    <form
      onSubmit={handleChanginSite}
      className="flex items-center justify-center"
    >
      <div className="w-[50px] h-[25px]">
        <IoIosArrowBack
          className={`${
            ((router.query.page as string) === "1" ||
              (router.query.page as string)) === undefined && "hidden"
          } w-[50px] h-[25px] cursor-pointer`}
          onClick={handlingBackSite}
        />
      </div>
      <input
        className="border border-gray-800 rounded-[3px] bg-transparent w-[40px] h-[40px] text-center font-bold text-[20px] placeholder-gray-900 focus:placeholder-gray-400"
        placeholder={(router.query.page as string) || "1"}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleInputChanging(e);
          }
        }}
      ></input>
      <div className="pl-[9px] text-[20px] font-bold">z {Math.ceil(pages)}</div>
      <div className="w-[50px] h-[25px]">
        {" "}
        <IoIosArrowForward
          className={`${
            parseInt(router.query.page as string) === Math.ceil(pages) &&
            "hidden"
          } w-[50px] h-[25px] cursor-pointer`}
          onClick={handlingNextSite}
        />
      </div>
    </form>
  );

  return (
    <div className="w-full h-[50px] flex items-center overflow-x-hidden place-content-center">
      {router.isReady && sitesChanger}
    </div>
  );
}
