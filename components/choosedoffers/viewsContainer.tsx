import React, { useRef, useState, useEffect } from "react";
import GalleryContainer from "./galleryView/galleryContainer";
import { useRouter } from "next/router";
import Plans from "./plans/plans";
import Other from "../otherOffers/other";
import Localization from "./localization/localization";
import Prices from "./prices/prices";

type Data = {
  handleMoreOffers: any;
  moreoffers: any;
  moreoffersTXT: any;
  moreoffersArrow: any;
};

export default function ViewsContainer({
  handleMoreOffers,
  moreoffers,
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
      <Other
        handleMoreOffers={handleMoreOffers}
        moreoffers={moreoffers}
        moreoffersTXT={moreoffersTXT}
        moreoffersArrow={moreoffersArrow}
      />
    </div>
  );
}
