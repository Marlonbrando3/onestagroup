import React from "react";
import Image from "next/image";
import { FaArrowLeft } from "react-icons/fa";

type props = {
  showGallery: any;
  setShowGallery: any;
  images: any[];
  showSlider: any;
  setShowSlider: any;
  choosedImage: any;
  setChoosedImage: any;
};

export default function Gallery({
  showGallery,
  setShowGallery,
  images,
  showSlider,
  setShowSlider,
  choosedImage,
  setChoosedImage,
}: props) {
  console.log(images);

  const handleShowingSlider = (e: any) => {
    console.log(e);
    setShowSlider(true);
    setChoosedImage(parseInt(e) - 1);
  };

  const imagesMiniData = images?.map((i: any, index: any) => {
    return (
      <div
        key={i["@_id"]}
        className="md:w-[30%] w-[45%] md:h-[40vh] h-[150px] relative cursor-pointer hover:brightness-125 duration-100"
        onClick={() => handleShowingSlider(i["@_id"])}
      >
        <Image
          src={i.url}
          fill
          objectFit="cover"
          alt="alt"
          className="rounded-md"
        ></Image>
        ;
      </div>
    );
  });

  const handleClosingGallery = () => {
    setShowGallery(false);
  };

  return (
    <>
      <div
        className={`${showGallery === true ? "opacity-100" : "opacity-0 pointer-events-none"} inset-0 w-full h-[100vh] z-[100] fixed top-[0px] bottom-0 my-auto flex flex-wrap justify-center items-start transition-opacity mx-auto bg-white gap-8 overflow-x-hidden shadow-[0_0px_10px_0_rgba(0,0,0,0.3)]`}
      >
        <div
          id="galler-container"
          className="w-full flex flex-wrap gap-6 justify-center md:-mt-[30px]"
        >
          <div className="w-full h-[40px] text-[18px] flex items-center md:pl-[50px] pl-[10px] bg-white sticky bg-white z-[110] top-0 ">
            <FaArrowLeft />
            <p
              className="ml-[10px] cursor-pointer"
              onClick={handleClosingGallery}
            >
              powrót do ogłoszenia
            </p>
          </div>
          {imagesMiniData}
        </div>
      </div>
      {showSlider === true && (
        <div className="absolute bg-white z-[901] w-full h-full sticky"></div>
      )}
    </>
  );
}
