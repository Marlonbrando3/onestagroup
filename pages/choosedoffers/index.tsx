import React from "react";
import Header from "@/components/choosedoffers/header";
import Menu from "@/components/choosedoffers/menu";
import GalleryContainer from "@/components/choosedoffers/galleryView/galleryContainer";
import ViewsContainer from "@/components/choosedoffers/ViewsContainer";

export default function Index() {
  return (
    <div className="h-screen bg-[url('/bg_calp.jpg')] bg-[length:400px_auto] md:bg-cover relative">
      <Header />
      <Menu />
      <ViewsContainer />
    </div>
  );
}
