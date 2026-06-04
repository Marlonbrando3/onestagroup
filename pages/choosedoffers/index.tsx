import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header";
import Menu from "@/components/choosedoffers/menu";
import ViewsContainer from "@/components/choosedoffers/viewsContainer";

export default function Index() {
  const showPopUp: any = useRef(null);
  const router = useRouter();

  const { recomended, menu, ...remainingQuery } = router.query;

  const siteId = 3555670;
  const hotjarVersion = 6;

  const [slideWidth, setSlideWidth]: any = useState();

  const handlePopUpOpen = async () => {
    await router.push({
      pathname: router.pathname,
      query: { ...remainingQuery, recomended: "true" },
    });
  };

  const handlePopUpClosing = async (event: any) => {
    await router.push({
      pathname: router.pathname,
      query: { ...remainingQuery, recomended: "false" },
    });
  };

  return (
    <div className="h-[89vh] md:h-screen bg-[url('/bg_calp.jpg')] bg-cover bg-center relative overflow-hidden pt-[74px] xl:pt-[82px]">
      <Header handleShowOffersPopup={handlePopUpOpen} />
      <Menu />
      <ViewsContainer
        handlePopUpOpen={handlePopUpOpen}
        handlePopUpClosing={handlePopUpClosing}
        showPopUp={showPopUp}
      />
    </div>
  );
}
