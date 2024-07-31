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
        router.pathname !== "/" &&
        router.pathname !== "/[country]/[offers]" &&
        router.pathname === "/[country]"
          ? "bg-red-600 rounded-b-xl border-blue-900 border-b-2 px-2 py-1 ml-4 mt-[20px] w-28 mr-4 z-0 lg:hidden fixed right-0 visible block"
          : "none"
      }
      onClick={handleShowMobileFilters}
    >
      <p
        ref={mobileButtonSearchEngine}
        className={
          router.pathname !== "/" &&
          router.pathname !== "/[country]/[offers]" &&
          router.pathname === "/[country]"
            ? "visible cursor-pointer text-white text-base flex justify-center font-bold"
            : "invisible"
        }
      >
        Filtry
      </p>
    </div>
  );
}
