import React from "react";
import GalleryContainer from "./galleryView/galleryContainer";
import { useRouter } from "next/router";
import Plans from "./plans/plans";
import Other from "../otherOffers/other";
import Localization from "./localization/localization";
import Prices from "./prices/prices";

export default function ViewsContainer() {
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
      <Other />
    </div>
  );
}
