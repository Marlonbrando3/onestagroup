import React, { useRef, useState, useEffect } from "react";
import GalleryContainer from "./galleryView/galleryContainer";
import { useRouter } from "next/router";
import Plans from "./plans/plans";
import Localization from "./localization/localization";
import Prices from "./prices/prices";
import Intrested from "../otherOffers/intrested";
import Buttons from "../otherOffers/buttons";

type Data = {
  handleMoreOffers: any;
  moreOffersRef: any;
  imIntresetedRef: any;
  moreoffersTXT: any;
  moreoffersArrow: any;
};

export default function ViewsContainer({
  handleMoreOffers,
  moreOffersRef,
  imIntresetedRef,
  moreoffersTXT,
  moreoffersArrow,
}: Data) {
  const router = useRouter();
  const { offer, id } = router.query;

  if (!router.isReady) {
    return <p>Ładowanie...</p>;
  }

  return (
    <div id="elemntsContainer" className="w-full h-[85vh] place-content-center grid">
      {id === "Galeria" && <GalleryContainer />}
      {id === "Plany" && <Plans />}
      {id === "Lokalizacja" && <Localization />}
      {id === "Cennik" && <Prices />}
      <div className="h-[50px] absolute  w-full bottom-0 left-0 right-0 mx-auto border ">
        <div className="relative h-full border w-full mx-auto">
          <Buttons
            handleMoreOffers={handleMoreOffers}
            moreOffersRef={moreOffersRef}
            moreoffersTXT={moreoffersTXT}
            moreoffersArrow={moreoffersArrow}
          />
        </div>
      </div>
    </div>
  );
}
