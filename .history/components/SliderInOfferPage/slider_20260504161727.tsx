import React, { useState, useRef } from "react";
import Image from "next/image";
import { FaWindowClose } from "react-icons/fa";
import { BsArrowRightSquareFill } from "react-icons/bs";
import { BsArrowLeftSquareFill } from "react-icons/bs";
import { FaArrowLeft } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import ContactOnPropertyCard from "../SearchEngine/ContactOnPropertyCard";
import ContactInSlider from "../SearchEngine/ContactInSlider";

type props = {
  images: any[];
  propertyDetails: any;
  showSlider: any;
  setShowSlider: any;
  choosedImage: any;
  setChoosedImage: any;
};

export default function Slider({
  images,
  propertyDetails,
  showSlider,
  setShowSlider,
  choosedImage,
  setChoosedImage,
}: props) {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: -140, y: 50 });
  const movedRef = useRef(false);

  const handleChangingImage = (e: any) => {
    setChoosedImage(e);
    console.log(e);
  };

  const handleNextImage = (e: any) => {
    e.stopPropagation();
    if (choosedImage < images.length - 1) setChoosedImage(choosedImage + 1);
  };

  const handleBeforeImage = (e: any) => {
    e.stopPropagation();
    if (choosedImage > 0) setChoosedImage(choosedImage - 1);
  };

  const handleClosingSlider = () => {
    setShowSlider(false);
    console.log("hide");
  };

  const imagesData = images.map((i, key) => {
    return (
      <div
        className={`${
          parseInt(i["@_id"]) === choosedImage + 1
            ? "border-yellow-500"
            : "border-transparent"
        } m-[2px] cursor-pointer h-[70px] w-[85px] relative border-[3px] hover:brightness-125`}
        onClick={() => handleChangingImage(key)}
        key={i["@_id"]}
      >
        <Image src={i.url} fill className="object-cover" alt="photo" />
      </div>
    );
  });

  const handleZoom = () => {
    setZoom(zoom === 1 ? 2 : 1);
  };

  const handleMouseMove = (e: any) => {
    if (zoom === 1) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPos({ x, y });
  };

  return (
    <div
      className={`${showSlider === true ? "opacity-100" : "opacity-0 pointer-events-none"} inset-0 w-full h-screen z-[100] fixed flex flex-wrap justify-center items-center transition-opacity`}
    >
      <div
        className={`${zoom === 2 ? "bg-white/[0.7]" : "z-[0]"} absolute w-full h-full `}
      ></div>
      <div className="bg-[#00102E] w-[100%] h-[100%] flex flex-wrap justify-start relative shadow-[0_0_15px_rgba(0,0,0,0.4)]">
        <div
          className="h-[50px] w-screen text-[16px] leading-[44px] pl-[20px] font-[300] flex items-center cursor-pointer text-white"
          onClick={handleClosingSlider}
        >
          <FaArrowLeft />
          <p className="inline pl-[10px]">powrót do galerii</p>
        </div>
        <IoIosClose
          className="absolute right-3 top-1 w-[40px] h-[40px] text-black cursor-pointer"
          onClick={handleClosingSlider}
        />

        {/* <div className="h-full w-[230px]">
          <div className="h-[80vh] w-full flex p-[5px] h-[80vh]">
            <div className="flex w-full flex-wrap px-[10px] flex-row overflow-y-auto h-full">
              {imagesData}
            </div>
          </div>
        </div> */}
        <div className="flex w-full w-justify-between md:items-center items-start px-[20px]">
          <div
            className="md:w-[75%] w-full md:h-[90vh] h-[400px] mx-auto relative flex cursor-zoom-in overflow-hidden"
            onMouseMove={handleMouseMove}
            onClick={handleZoom}
          >
            {" "}
            <div className="my-auto">
              <BsArrowLeftSquareFill
                className="absolute z-[110] left-4 text-white/[0.8] text-black w-[50px] h-[50px] top-0 bottom-0 my-auto cursor-pointer md:block select-none shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                onClick={(e) => handleBeforeImage(e)}
              />
            </div>
            <Image
              src={images[choosedImage].url}
              fill
              className="object-cover p-2 transition-transform duration-200"
              alt="alt"
              draggable={false}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: `${pos.x}% ${pos.y}%`,
              }}
            ></Image>
            <div className="absolute w-[110px] h-[35px] bottom-4 right-0 left-0 mx-auto rounded-2xl bg-white flex items-center justify-center text-[22px] font-[500]">
              {choosedImage} z {images.length}
            </div>
            <div className="my-auto">
              <BsArrowRightSquareFill
                className="absolute z-[110] right-4 text-white/[0.8] w-[50px] h-[50px] top-0 bottom-0 my-auto cursor-pointer md:block  select-none shadow-[0_0_15px_rgba(0,0,0,0.4)]"
                onClick={(e) => handleNextImage(e)}
              />
            </div>
          </div>
          <div className="w-[300px] h-auto hidden md:block">
            <ContactInSlider propertyRef={propertyDetails.external_id} />
          </div>
        </div>
      </div>
    </div>
  );
}
