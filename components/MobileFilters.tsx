import { useRouter } from "next/router";
import React, { Ref } from "react";

type Function = {
  handleShowMobileFilters: any;
  mobileButtonSearchEngine: any;
  searchEngine: any;
};

export default function MobileFilters({
  handleShowMobileFilters,
  searchEngine,
  mobileButtonSearchEngine,
}: Function) {
  const router = useRouter();

  return (
    <div
      className={
        router.pathname !== "/nieruchomosci" &&
        router.pathname !== "/nieruchomosci/[country]/[offers]" &&
        router.pathname === "/nieruchomosci/[country]"
          ? "bg-gradient-to-r from-orange-500  to-indigo-400 rounded-b-xl border-blue-900 border-b-2 px-2 py-1 ml-4 mt-[0px] w-44 mr-4 z-0 lg:hidden fixed right-0 visible block"
          : "none"
      }
      onClick={handleShowMobileFilters}
    >
      <p
        ref={mobileButtonSearchEngine}
        className={
          router.pathname !== "/nieruchomsci" &&
          router.pathname !== "/nieruchomosci/[country]/[offers]" &&
          router.pathname === "/nieruchomosci/[country]"
            ? "visible cursor-pointer text-white text-base flex justify-center font-bold z-50"
            : "invisible"
        }
      >
        Filtry
      </p>
    </div>
  );
}
