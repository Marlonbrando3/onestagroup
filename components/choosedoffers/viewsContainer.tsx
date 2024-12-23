import React from "react";
import GalleryContainer from "./galleryView/galleryContainer";

export default function ViewsContainer() {
  return (
    <div id="elemntsContainer" className="w-full h-[85vh] place-content-center grid">
      <GalleryContainer />
    </div>
  );
}
