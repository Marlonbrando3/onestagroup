import { useRouter } from "next/router";
import React from "react";

export default function MobileFilters() {
  const router = useRouter();

  // const handleShowMobileFilters = () => {
  //   setShowSearchComponentsOnMobile(
  //     (showSearchComponentsOnMobile) => !showSearchComponentsOnMobile,
  //   );
  // };

  // console.log(router.pathname)

  return (
    <div
      className={
        router.pathname !== "/" &&
        router.pathname !== "/[country]/[offers]" &&
        router.pathname === "/[country]"
          ? "bg-red-600 rounded-b-xl border-blue-900 border-b-2 px-2 py-1 ml-4 w-28 mr-4 z-0 lg:hidden fixed top-16 right-0 visible block"
          : "none"
      }
      // onClick={handleShowMobileFilters}
    >
      <p
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
