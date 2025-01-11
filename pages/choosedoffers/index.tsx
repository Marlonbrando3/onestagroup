import React from "react";
import Header from "@/components/choosedoffers/header";
import Menu from "@/components/choosedoffers/menu";
import GalleryContainer from "@/components/choosedoffers/galleryView/galleryContainer";
import ViewsContainer from "@/components/choosedoffers/viewsContainer";

export default function Index() {
  return (
    <div className="h-[89vh] md:h-screen bg-[url('/bg_calp.jpg')] bg-cover bg-center relative overflow-hidden">
      <Header />
      <Menu />
      <ViewsContainer />
    </div>
  );
}
