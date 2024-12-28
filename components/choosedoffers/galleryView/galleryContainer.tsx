import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import Properties from "../../../public/properties.json";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import Index from "@/pages/form";

export default function GalleryContainer() {
  const choosedProperty = Properties.filter((i: any) => i.listingId === "6/15982/OMS");
  const PropertyImagesArray = choosedProperty[0].images;

  const [indexImage, setIndexImage] = useState(0);
  const choosedImage = choosedProperty[0].images[indexImage].id;

  //slider varables
  const ImagesPerViewMiniSlider = 3;
  const marginPerImage = 186;
  const jumpFor = 3 * marginPerImage;
  const propertyImagesLength = PropertyImagesArray.length;
  const marginFullLength = PropertyImagesArray.length * marginPerImage;
  const marginPerView = ImagesPerViewMiniSlider * marginPerImage;

  const [whichSliderSetIsActive, setWhichSliderSetIsActive] = useState(0);

  const [margin, setMargin] = useState(0);

  const miniSlider: any = useRef();

  const handleChoosingImage = (index: any) => {
    setIndexImage(index);
  };

  // console.log(choosedImage);
  // console.log(choosedProperty[0].images[indexImage].id);

  const PropertyImages = PropertyImagesArray.map((i, index) => (
    <div
      key={index}
      onClick={(e) => handleChoosingImage(index)}
      className="w-[186px] h-[100px] relative flex-none cursor-pointer"
    >
      <Image
        src={`https://img.asariweb.pl/normal/${i.id}`}
        alt="lala"
        fill
        objectFit="cover"
        className={`${
          i.id === choosedProperty[0].images[indexImage].id ? "border-orange-600" : "border-white"
        } border-[3px] hover:border-orange-400 duration-200 rounded-md`}
      />
    </div>
  ));

  // console.log(PropertyImages);

  const handleChangingSlideForward = () => {
    if (margin - marginPerView < marginFullLength !== margin >= marginFullLength - marginPerView) {
      const maringData = margin;
      const newMaring = maringData + jumpFor;
      miniSlider.current.style.marginLeft = `-${newMaring}px`;
      setMargin(newMaring);
    } else {
      console.log("OKOKOK");
      miniSlider.current.style.marginLeft = `0px`;
      setMargin(0);
    }

    console.log(marginFullLength - marginPerView);
    console.log(margin);
  };

  const handleChangingSlideBack = () => {
    if (margin !== 0) {
      const maringData = margin;
      const newMaring = maringData - jumpFor;
      miniSlider.current.style.marginLeft = `-${newMaring}px`;
      setMargin(newMaring);
    }
  };

  //check on which site is your image

  const handleChangingSlideForwardMain = () => {
    // console.log(whichSliderSetIsActive);
    if (indexImage < propertyImagesLength - 1) {
      const slider = Math.floor((indexImage + 1) / ImagesPerViewMiniSlider);
      const newMaring = slider * jumpFor;
      miniSlider.current.style.marginLeft = `-${newMaring}px`;
      setMargin(newMaring);
      setIndexImage(indexImage + 1);
    } else {
      setIndexImage(0);
      miniSlider.current.style.marginLeft = `0px`;
      setMargin(0);
      setWhichSliderSetIsActive(0);
    }
  };

  const handleChangingSlideBackMain = () => {
    if (indexImage > 0) {
      const slider = Math.floor((indexImage - 1) / ImagesPerViewMiniSlider);
      const newMaring = slider * jumpFor;
      miniSlider.current.style.marginLeft = `-${newMaring}px`;
      setMargin(newMaring);
      setIndexImage(indexImage - 1);
    }
  };

  return (
    <div className="w-[700px] h-[600px] bg-white place-content-center rounded-xl">
      <div className="w-[80%] h-[80%] mx-auto relative">
        <div
          onClick={handleChangingSlideBackMain}
          className="h-[80%] w-[50px] absolute -left-[50px] place-content-center grid cursor-pointer"
        >
          <IoIosArrowBack
            onClick={handleChangingSlideBackMain}
            className="w-[50px] h-[50px] cursor-pointer"
          />
        </div>
        <div
          onClick={handleChangingSlideForwardMain}
          className="h-[80%] w-[50px] absolute -right-[50px] place-content-center grid cursor-pointer"
        >
          <IoIosArrowForward
            onClick={handleChangingSlideForwardMain}
            className="w-[50px] h-[50px] cursor-pointer"
          />
        </div>
        <div className="font-bold text-[12px]">
          {indexImage + 1} / {propertyImagesLength}
        </div>
        <div className="w-[100%] h-[80%] relative mb-[5px]">
          <Image
            src={`https://img.asariweb.pl/normal/${choosedImage}`}
            fill
            objectFit="cover"
            alt="Hiszpania"
            className="rounded-md"
          />
        </div>
        {/* //slider mini */}
        <div className="w-full h-[22%] flex relative">
          <div
            onClick={handleChangingSlideBack}
            className={`${
              margin === 0 && "text-gray-200"
            } h-[100%] w-[50px] absolute -left-[50px] place-content-center grid cursor-pointer`}
          >
            <IoIosArrowBack
              onClick={handleChangingSlideBack}
              className="w-[30px] h-[30px] cursor-pointer"
            />
          </div>
          <div className="w-full overflow-hidden">
            <div ref={miniSlider} className="w-full flex duration-200">
              {PropertyImages}
            </div>
          </div>
          <div
            onClick={handleChangingSlideForward}
            className="h-[100%] w-[50px] absolute -right-[50px] place-content-center grid cursor-pointer"
          >
            <IoIosArrowForward
              onClick={handleChangingSlideForward}
              className="w-[30px] h-[30px] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
